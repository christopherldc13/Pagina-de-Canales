import { useState } from 'react'
import { useChannels } from '../context/ChannelsContext'

const PRESETS = [
  { label:'Rep. Dominicana', flag:'🇩🇴', url:'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/do.m3u' },
  { label:'España',          flag:'🇪🇸', url:'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/es.m3u' },
  { label:'Latinoamérica',   flag:'🌎', url:'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/us_latino.m3u' },
]

export default function M3ULoader() {
  const { loadChannels, loading } = useChannels()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const load = (u) => { loadChannels(u); setOpen(false) }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display:'flex', alignItems:'center', gap:7,
          padding:'7px 14px', borderRadius:9, fontSize:13, fontWeight:600,
          background:'var(--surface2)', border:'1px solid var(--border2)',
          color:'var(--text2)', cursor:'pointer', transition:'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent2)'; e.currentTarget.style.color='var(--text1)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.color='var(--text2)' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h7"/>
        </svg>
        Otra lista
      </button>

      {open && (
        <div
          style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)' }}
          onClick={e => { if (e.target===e.currentTarget) setOpen(false) }}
        >
          <div style={{ width:'100%', maxWidth:420, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:18, overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.7)' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 16px', borderBottom:'1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:'var(--text1)' }}>Cambiar lista</p>
                <p style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>Escoge una región o pega tu URL M3U</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ width:28, height:28, borderRadius:8, background:'var(--bg)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="12" height="12" fill="none" stroke="var(--text2)" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
              {/* Presets */}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {PRESETS.map(p => (
                  <button
                    key={p.url}
                    onClick={() => load(p.url)}
                    disabled={loading}
                    style={{
                      display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:11,
                      background:'var(--bg)', border:'1px solid var(--border)', cursor:'pointer',
                      transition:'all 0.15s', textAlign:'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background='rgba(109,40,217,0.08)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg)' }}
                  >
                    <span style={{ fontSize:22 }}>{p.flag}</span>
                    <span style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1, height:1, background:'var(--border)' }} />
                <span style={{ fontSize:11, color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>o URL personalizada</span>
                <div style={{ flex:1, height:1, background:'var(--border)' }} />
              </div>

              {/* URL input */}
              <form onSubmit={e => { e.preventDefault(); if(url.trim()) load(url.trim()) }} style={{ display:'flex', gap:8 }}>
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://mi-lista.m3u"
                  style={{
                    flex:1, background:'var(--bg)', border:'1px solid var(--border2)', borderRadius:9,
                    padding:'9px 13px', fontSize:13, color:'var(--text1)', outline:'none',
                  }}
                  onFocus={e => e.target.style.borderColor='var(--accent)'}
                  onBlur={e => e.target.style.borderColor='var(--border2)'}
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  style={{
                    padding:'9px 16px', borderRadius:9, fontSize:13, fontWeight:700,
                    background:'linear-gradient(135deg,var(--accent2),var(--accent))',
                    color:'#fff', border:'none', cursor:'pointer', flexShrink:0,
                    opacity: loading||!url.trim() ? 0.4 : 1,
                  }}
                >
                  {loading ? '...' : 'Cargar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
