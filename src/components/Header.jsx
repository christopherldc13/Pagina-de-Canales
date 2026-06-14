import M3ULoader from './M3ULoader'
import { useChannels } from '../context/ChannelsContext'

export default function Header() {
  const { activeChannel, loading, channels } = useChannels()

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: '56px', flexShrink: 0,
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg,#7c3aed,#4338ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text1)', letterSpacing: '-0.3px' }}>
          StreamTV
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'var(--accent2)',
          background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 20, padding: '2px 8px',
        }}>
          🇩🇴 República Dominicana
        </span>

        {loading && (
          <span style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
            Cargando canales...
          </span>
        )}
        {!loading && channels.length > 0 && (
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{channels.length} canales</span>
        )}
      </div>

      {/* Now playing */}
      {activeChannel && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', borderRadius: 20,
          background: 'var(--bg)', border: '1px solid var(--border)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
          <span style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeChannel.name}
          </span>
        </div>
      )}

      <M3ULoader />
    </header>
  )
}
