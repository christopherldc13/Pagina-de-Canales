import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { useChannels } from '../context/ChannelsContext'

function IconPlay() {
  return (
    <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}
function IconPause() {
  return (
    <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  )
}
function IconVolume({ muted }) {
  return muted
    ? <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
    : <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
}
function IconFullscreen() {
  return (
    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
  )
}

export default function VideoPlayer() {
  const { activeChannel } = useChannels()
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const containerRef = useRef(null)
  const hideTimeout = useRef(null)

  const [error, setError] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    if (!activeChannel || !videoRef.current) return

    setError(false); setBuffering(true); setPaused(false)

    // Collect all available stream URLs for this channel
    const urls = activeChannel.urls?.length ? activeChannel.urls : [activeChannel.url]
    let index = 0
    let destroyed = false
    let timer = null
    let hls = null

    const cleanup = () => {
      destroyed = true
      clearTimeout(timer)
      if (hls) { hls.destroy(); hls = null }
      hlsRef.current = null
    }

    const tryNext = () => {
      if (destroyed) return
      index++
      if (index < urls.length) {
        attempt(urls[index])
      } else {
        setError(true)
        setBuffering(false)
      }
    }

    const attempt = (url) => {
      if (destroyed) return

      // Destroy previous HLS instance before starting a new attempt
      if (hls) { hls.destroy(); hls = null; hlsRef.current = null }
      clearTimeout(timer)

      // Per-URL timeout: 10s to connect, then try next URL
      timer = setTimeout(tryNext, 10000)

      if (Hls.isSupported() && !url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          startPosition: -1,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          backBufferLength: 10,
          highBufferWatchdogPeriod: 2,
          nudgeMaxRetry: 5,
          manifestLoadingTimeOut: 8000,
          manifestLoadingMaxRetry: 1,
          levelLoadingTimeOut: 8000,
          levelLoadingMaxRetry: 1,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 3,
          fragLoadingRetryDelay: 500,
        })
        hlsRef.current = hls

        hls.loadSource(url)
        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          clearTimeout(timer)
          videoRef.current?.play().catch(() => {})
          setBuffering(false)
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            clearTimeout(timer)
            tryNext()
          }
        })
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = `/proxy?url=${encodeURIComponent(url)}`
        videoRef.current.play().catch(tryNext)
      } else {
        videoRef.current.src = url
        videoRef.current.play().catch(tryNext)
      }
    }

    attempt(urls[0])
    return cleanup
  }, [activeChannel])

  const revealControls = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimeout.current)
    hideTimeout.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPaused(false) }
    else { v.pause(); setPaused(true) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const changeVolume = (val) => {
    const v = videoRef.current
    if (!v) return
    v.volume = val
    v.muted = val === 0
    setVolume(val)
    setMuted(val === 0)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  if (!activeChannel) return (
    <div style={{
      width:'100%', aspectRatio:'16/9', borderRadius:16,
      background:'var(--surface)', border:'1px solid var(--border)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
    }}>
      <div style={{ width:56, height:56, borderRadius:14, background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="26" height="26" fill="none" stroke="var(--text3)" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      </div>
      <p style={{ fontSize:15, fontWeight:600, color:'var(--text3)' }}>Selecciona un canal</p>
    </div>
  )

  return (
    <div
      ref={containerRef}
      onMouseMove={revealControls}
      onMouseEnter={revealControls}
      onClick={togglePlay}
      style={{
        width:'100%', aspectRatio:'16/9', borderRadius:16, overflow:'hidden',
        position:'relative', background:'#000', cursor:'pointer',
        boxShadow: error ? 'none' : '0 8px 40px rgba(109,40,217,0.2), 0 2px 8px rgba(0,0,0,0.6)',
        border:'1px solid var(--border)',
      }}
    >
      {/* Spinner */}
      {buffering && !error && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)', zIndex:5 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(109,40,217,0.3)', borderTopColor:'var(--accent2)', animation:'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, background:'var(--surface)', zIndex:5 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="22" height="22" fill="none" stroke="#ef4444" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636"/>
            </svg>
          </div>
          <p style={{ fontSize:14, color:'var(--text2)' }}>Señal no disponible</p>
          <p style={{ fontSize:12, color:'var(--text3)' }}>Selecciona otro canal</p>
        </div>
      )}

      <video
        ref={videoRef}
        style={{ width:'100%', height:'100%', display:'block' }}
        autoPlay
        playsInline
        onWaiting={() => setBuffering(true)}
        onPlaying={() => { setBuffering(false); setError(false) }}
        onPause={() => setPaused(true)}
        onPlay={() => setPaused(false)}
        onError={() => { if (!hlsRef.current) { setError(true); setBuffering(false) } }}
      />

      {/* Top badge */}
      <div style={{
        position:'absolute', top:14, left:14, display:'flex', alignItems:'center', gap:8,
        padding:'6px 12px', borderRadius:8, zIndex:10,
        background:'rgba(0,0,0,0.65)', backdropFilter:'blur(12px)',
        border:'1px solid rgba(255,255,255,0.08)',
        opacity: showControls ? 1 : 0, transition:'opacity 0.3s',
        pointerEvents:'none',
      }}>
        {activeChannel.logo && (
          <img src={activeChannel.logo} alt="" style={{ height:18, objectFit:'contain' }} onError={e => e.target.style.display='none'} />
        )}
        <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{activeChannel.name}</span>
        <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:800, color:'#ef4444', letterSpacing:'0.06em' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'pulse 1.5s infinite' }} />
          EN VIVO
        </span>
      </div>

      {/* Bottom controls */}
      <div
        style={{
          position:'absolute', bottom:0, left:0, right:0, zIndex:10,
          padding:'40px 16px 14px',
          background:'linear-gradient(transparent, rgba(0,0,0,0.85))',
          display:'flex', alignItems:'center', gap:12,
          opacity: showControls ? 1 : 0, transition:'opacity 0.3s',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={togglePlay} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
          {paused ? <IconPlay /> : <IconPause />}
        </button>

        <div style={{
          display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:5,
          background:'#ef4444', fontSize:11, fontWeight:800, color:'#fff', letterSpacing:'0.08em',
        }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:'#fff', display:'inline-block', animation:'pulse 1.5s infinite' }} />
          EN VIVO
        </div>

        <div style={{ flex:1 }} />

        <div style={{ display:'flex', alignItems:'center', gap:8 }} onClick={e => e.stopPropagation()}>
          <button onClick={toggleMute} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
            <IconVolume muted={muted} />
          </button>
          <input
            type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={e => changeVolume(parseFloat(e.target.value))}
            style={{ width:70, accentColor:'white', cursor:'pointer' }}
          />
        </div>

        <button onClick={toggleFullscreen} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
          <IconFullscreen />
        </button>
      </div>
    </div>
  )
}
