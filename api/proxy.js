export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const urlObj = new URL(targetUrl);
    
    // Some servers require specific headers to allow fetching
    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Referer': urlObj.origin + '/',
      'Origin': urlObj.origin
    };

    // Override specifically for telemicro just in case
    if (urlObj.hostname.includes('telemicro.com.do')) {
      fetchHeaders['Referer'] = 'https://telemicro.com.do/';
      fetchHeaders['Origin'] = 'https://telemicro.com.do';
    }

    const response = await fetch(targetUrl, {
      headers: fetchHeaders
    });

    if (!response.ok) {
      return new Response(`Error from source: ${response.status}`, { 
        status: response.status === 403 ? 403 : 502,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const headers = new Headers(response.headers);
    // Remove headers that might cause issues
    headers.delete('content-encoding');
    headers.delete('content-length');
    headers.delete('transfer-encoding');
    
    // Add CORS headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    
    const contentType = headers.get('content-type') || '';

    // If it's a playlist, rewrite the inner URLs
    if (targetUrl.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('application/x-mpegurl')) {
      const text = await response.text();
      const targetBase = new URL(targetUrl);
      
      const modifiedText = text.split('\n').map(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return line;
        
        let absoluteUrl;
        if (line.startsWith('http://') || line.startsWith('https://')) {
          absoluteUrl = line;
        } else {
          absoluteUrl = new URL(line, targetBase).href;
        }
        
        // Pass inner URLs through the proxy again
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
      }).join('\n');
      
      headers.set('Content-Type', 'application/vnd.apple.mpegurl');
      return new Response(modifiedText, { status: 200, headers });
    }

    // For video chunks (.ts) and other files, stream them directly
    return new Response(response.body, { status: 200, headers });
    
  } catch (err) {
    console.error('Proxy Error:', err);
    return new Response('Proxy Server Error', { status: 500 });
  }
}
