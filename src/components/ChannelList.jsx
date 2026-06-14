import { useChannels } from '../context/ChannelsContext'
import ChannelCard from './ChannelCard'

function Skeleton() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px' }}>
      <div style={{ width:20 }} />
      <div className="shimmer" style={{ width:36, height:36, borderRadius:8, flexShrink:0 }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
        <div className="shimmer" style={{ height:12, borderRadius:6, width:'65%' }} />
      </div>
    </div>
  )
}

export default function ChannelList() {
  const { filtered, loading, error, channels } = useChannels()

  if (loading) return <div>{Array.from({length:14}).map((_,i) => <Skeleton key={i} />)}</div>

  if (error) return (
    <div style={{ padding:'32px 16px', textAlign:'center' }}>
      <p style={{ color:'var(--red)', fontSize:13, marginBottom:4 }}>Error al cargar</p>
      <p style={{ color:'var(--text3)', fontSize:12 }}>{error}</p>
    </div>
  )

  if (!channels.length) return (
    <div style={{ padding:'48px 16px', textAlign:'center' }}>
      <p style={{ color:'var(--text3)', fontSize:13 }}>Carga una lista M3U</p>
    </div>
  )

  if (!filtered.length) return (
    <div style={{ padding:'32px 16px', textAlign:'center' }}>
      <p style={{ color:'var(--text3)', fontSize:13 }}>Sin resultados</p>
    </div>
  )

  return (
    <div>
      {filtered.map((ch, i) => <ChannelCard key={`${ch.url}-${i}`} channel={ch} />)}
    </div>
  )
}
