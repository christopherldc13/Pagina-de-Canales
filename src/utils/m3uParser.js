export function parseM3U(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const channels = []

  let current = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('#EXTINF:')) {
      current = {}
      // Extract duration and tags
      const nameMatch = line.match(/,(.+)$/)
      if (nameMatch) {
        const raw = nameMatch[1].trim()
        // Store raw name and clean display name (strip quality/availability tags)
        current.rawName = raw
        current.name = raw
          .replace(/\s*\(\d{3,4}[pi]\)/gi, '')
          .replace(/\s*\[Not 24\/7\]/gi, '')
          .replace(/\s*\[Geo-blocked\]/gi, '')
          .replace(/\s*\[Geo-Block\]/gi, '')
          .trim()
      }

      const logoMatch = line.match(/tvg-logo="([^"]*)"/)
      if (logoMatch) current.logo = logoMatch[1]

      const groupMatch = line.match(/group-title="([^"]*)"/)
      if (groupMatch) current.group = groupMatch[1]
      else current.group = 'Sin categoría'

      const idMatch = line.match(/tvg-id="([^"]*)"/)
      if (idMatch) current.id = idMatch[1]

    } else if (current && !line.startsWith('#')) {
      current.url = line
      current.id = current.id || current.name
      channels.push(current)
      current = null
    }
  }

  return channels
}

export async function fetchM3U(url) {
  // Try direct fetch first (works for CORS-enabled servers like GitHub raw)
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (res.ok) {
      const text = await res.text()
      return parseM3U(text)
    }
  } catch (_) {
    // fall through to proxy
  }

  // Fallback: CORS proxy
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  const res = await fetch(proxyUrl)
  if (!res.ok) throw new Error('No se pudo cargar la lista M3U')
  const text = await res.text()
  return parseM3U(text)
}
