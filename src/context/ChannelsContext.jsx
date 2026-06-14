import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { fetchM3U } from '../utils/m3uParser'
import { getLogo, getChannelNumber } from '../utils/dominicanLogos'
import { EXTRA_STREAMS, nameKey } from '../utils/dominicanStreams'

const DO_M3U   = 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/do.m3u'
// Secondary list with reliable u.tvabierta.net streams for major Dominican channels
const OPENTTD  = 'https://raw.githubusercontent.com/giezimanuel/openttd/master/rd.m3u'

const ChannelsContext = createContext(null)

function enrichChannel(ch) {
  return {
    ...ch,
    logo: ch.logo || getLogo(ch.id),
    channelNum: getChannelNumber(ch.id),
  }
}

export function ChannelsProvider({ children }) {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeChannel, setActiveChannel] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('Todos')

  const loadChannels = useCallback(async (url) => {
    setLoading(true)
    setError(null)
    try {
      // Load primary list + openttd list in parallel for better coverage
      const isDefault = url === DO_M3U
      const [primary, secondary] = await Promise.all([
        fetchM3U(url),
        isDefault ? fetchM3U(OPENTTD).catch(() => []) : Promise.resolve([]),
      ])

      const raw = [...primary, ...secondary]

      const sorted = raw
        .map(enrichChannel)
        .sort((a, b) => {
          if (a.channelNum !== b.channelNum) return a.channelNum - b.channelNum
          return (a.name || '').localeCompare(b.name || '')
        })

      // Group by fuzzy name key — merges e.g. "Tele Antillas" with "RD Teleantillas"
      const grouped = new Map()
      sorted.forEach(ch => {
        const key = nameKey(ch.name)
        if (!grouped.has(key)) {
          grouped.set(key, { ...ch, urls: [ch.url] })
        } else {
          const existing = grouped.get(key)
          if (!existing.urls.includes(ch.url)) existing.urls.push(ch.url)
        }
      })

      // Prepend curated u.tvabierta.net URLs as first-priority for known channels
      const enriched = Array.from(grouped.values()).map(ch => {
        const key = nameKey(ch.name)
        const extras = EXTRA_STREAMS[key] || []
        
        let merged = ch.urls
        if (extras.length > 0) {
          merged = [...extras, ...ch.urls.filter(u => !extras.includes(u))]
        }

        // Apply Vercel proxy to all stream URLs to bypass CORS and Mixed Content
        const proxiedUrls = merged.map(u => `/api/proxy?url=${encodeURIComponent(u)}`)
        
        return { ...ch, url: proxiedUrls[0], urls: proxiedUrls, originalUrls: merged }
      })

      setChannels(enriched)
      if (enriched.length > 0) setActiveChannel(enriched[0])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadChannels(DO_M3U) }, [loadChannels])

  const groups = ['Todos', ...new Set(channels.map(c => c.group).filter(Boolean))]

  const filtered = channels.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase())
    const matchGroup = selectedGroup === 'Todos' || c.group === selectedGroup
    return matchSearch && matchGroup
  })

  return (
    <ChannelsContext.Provider value={{
      channels, filtered, loading, error,
      activeChannel, setActiveChannel, loadChannels,
      search, setSearch, groups, selectedGroup, setSelectedGroup,
    }}>
      {children}
    </ChannelsContext.Provider>
  )
}

export function useChannels() {
  return useContext(ChannelsContext)
}
