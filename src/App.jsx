import { ChannelsProvider } from './context/ChannelsContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import VideoPlayer from './components/VideoPlayer'
import { useChannels } from './context/ChannelsContext'
import './index.css'

function NowPlayingBar() {
  const { activeChannel } = useChannels()
  if (!activeChannel) return null
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'10px 16px', borderRadius:12, flexShrink:0,
      background:'var(--surface)', border:'1px solid var(--border)',
    }}>
      {activeChannel.logo && (
        <div style={{ width:36, height:36, borderRadius:8, overflow:'hidden', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <img src={activeChannel.logo} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', padding:3 }} onError={e => e.target.style.display='none'} />
        </div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:14, fontWeight:700, color:'var(--text1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {activeChannel.name}
        </p>
        {activeChannel.group && activeChannel.group !== 'Sin categoría' && (
          <p style={{ fontSize:12, color:'var(--text3)', marginTop:1 }}>{activeChannel.group}</p>
        )}
      </div>
      <div style={{
        display:'flex', alignItems:'center', gap:5,
        padding:'4px 10px', borderRadius:20, flexShrink:0,
        background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)',
        fontSize:11, fontWeight:800, color:'var(--red)', letterSpacing:'0.06em',
      }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--red)', animation:'pulse 1.5s infinite', display:'inline-block' }} />
        EN VIVO
      </div>
    </div>
  )
}

function Layout() {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)' }}>
      <Header />
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar />
        <main style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:12 }}>
          <VideoPlayer />
          <NowPlayingBar />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <ChannelsProvider><Layout /></ChannelsProvider>
}
