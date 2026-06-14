import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import http from 'http'
import https from 'https'

// Simple CORS proxy — forwards requests to external servers.
// URL rewriting is no longer needed because the Service Worker (public/sw.js)
// intercepts every external request from HLS.js and routes it here.
function corsProxyPlugin() {
  return {
    name: 'cors-proxy',
    configureServer(server) {
      server.middlewares.use('/proxy', (req, res) => {
        // Handle CORS preflight
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', '*')
        if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }

        try {
          const qs = req.url.startsWith('?') ? req.url.slice(1) : req.url.replace(/^[^?]*\??/, '')
          const target = new URLSearchParams(qs).get('url')
          if (!target) { res.statusCode = 400; res.end('Missing url'); return }

          const parsed = new URL(target)
          const isHttps = parsed.protocol === 'https:'
          const client = isHttps ? https : http

          // rejectUnauthorized:false allows streaming servers with self-signed/expired certs
          const agent = isHttps
            ? new https.Agent({ rejectUnauthorized: false, keepAlive: true })
            : new http.Agent({ keepAlive: true })

          const options = {
            hostname: parsed.hostname,
            port: parsed.port || (isHttps ? 443 : 80),
            path: parsed.pathname + parsed.search,
            method: 'GET',
            agent,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': parsed.origin + '/',
              'Origin': parsed.origin,
            },
            timeout: 30000,
          }

          const proxyReq = client.request(options, (proxyRes) => {
            // Follow redirects
            if ([301, 302, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
              const loc = proxyRes.headers.location.startsWith('http')
                ? proxyRes.headers.location
                : `${parsed.origin}${proxyRes.headers.location}`
              res.writeHead(302, { 'Location': `/proxy?url=${encodeURIComponent(loc)}` })
              res.end()
              return
            }

            res.statusCode = proxyRes.statusCode || 200
            res.setHeader('Cache-Control', 'no-cache')

            const ct = proxyRes.headers['content-type'] || ''
            // Force correct content-type for HLS playlists
            if (ct.includes('mpegurl') || target.match(/\.m3u8?(\?|$)/i)) {
              res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
            } else if (ct) {
              res.setHeader('Content-Type', ct)
            }

            // Pipe the response directly — no buffering, no URL rewriting
            proxyRes.pipe(res)
          })

          proxyReq.on('error', err => {
            if (!res.headersSent) { res.statusCode = 502; res.end(err.message) }
          })
          proxyReq.on('timeout', () => {
            proxyReq.destroy()
            if (!res.headersSent) { res.statusCode = 504; res.end('Timeout') }
          })

          proxyReq.end()
        } catch (err) {
          if (!res.headersSent) { res.statusCode = 500; res.end(err.message) }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), corsProxyPlugin()],
})
