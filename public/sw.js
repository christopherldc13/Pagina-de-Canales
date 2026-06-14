// Service Worker: CORS bypass for HLS.js stream requests.
// Strategy: try the URL directly first (many CDNs have CORS headers).
// If direct fails (CORS blocked), route through the local proxy as fallback.

const ORIGIN = self.location.origin

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Same-origin requests (Vite assets, /proxy calls) — pass through untouched
  if (url.origin === ORIGIN) return

  // Only intercept HLS-related requests (playlists + segments)
  const path = url.pathname.toLowerCase()
  const isMedia = path.endsWith('.m3u8') || path.endsWith('.m3u') ||
                  path.endsWith('.ts') || path.endsWith('.aac') ||
                  path.endsWith('.mp4') || path.includes('/memfs/') ||
                  url.port !== ''

  if (!isMedia && !url.hostname.match(/\d+\.\d+\.\d+\.\d+/)) return

  event.respondWith(
    // Try direct access first — CDNs like tvabierta.net, cloudfront, akamai often have CORS
    fetch(event.request.url, { cache: 'no-store', mode: 'cors' })
      .catch(() => {
        // Direct blocked by CORS or network error — route through local proxy
        const target = `${ORIGIN}/proxy?url=${encodeURIComponent(event.request.url)}`
        return fetch(target, { cache: 'no-store' })
          .catch(() => new Response('unavailable', { status: 502 }))
      })
  )
})
