import { useChannels } from '../context/ChannelsContext'

const COLORS = [
  '#6d28d9','#1d4ed8','#0f766e','#b45309',
  '#be185d','#7c3aed','#0369a1','#15803d',
]
function pickColor(name = '') {
  let h = 5381
  for (let i = 0; i < name.length; i++) h = ((h << 5) + h + name.charCodeAt(i)) | 0
  return COLORS[Math.abs(h) % COLORS.length]
}

export default function ChannelCard({ channel }) {
  const { activeChannel, setActiveChannel } = useChannels()
  const active = activeChannel?.url === channel.url
  const num = channel.channelNum !== 999 ? channel.channelNum : null
  const color = pickColor(channel.name)

  return (
    <button
      onClick={() => setActiveChannel(channel)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '8px 10px', borderRadius: 10,
        background: active ? 'rgba(109,40,217,0.15)' : 'transparent',
        border: `1px solid ${active ? 'rgba(109,40,217,0.4)' : 'transparent'}`,
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s, border-color 0.1s',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' } }}
    >
      {/* Number */}
      <span style={{
        fontSize: 11, fontWeight: 700, color: active ? 'var(--accent2)' : 'var(--text3)',
        width: 20, textAlign: 'right', flexShrink: 0, lineHeight: 1,
      }}>
        {num ?? ''}
      </span>

      {/* Avatar / Logo */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
        background: color + '22', border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {channel.logo
          ? <img src={channel.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 3 }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
          : null}
        <span style={{
          display: channel.logo ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          width: '100%', height: '100%',
          fontSize: 14, fontWeight: 800, color,
        }}>
          {(channel.name||'?').replace(/[^A-Za-z0-9]/g,'')[0]?.toUpperCase() ?? '?'}
        </span>
      </div>

      {/* Name */}
      <span style={{
        flex: 1, fontSize: 13, fontWeight: active ? 600 : 500,
        color: active ? 'var(--text1)' : 'var(--text2)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3,
      }}>
        {channel.name}
      </span>

      {/* Live dot */}
      {active && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: 'var(--red)',
          flexShrink: 0, animation: 'pulse 1.5s infinite',
        }} />
      )}
    </button>
  )
}
