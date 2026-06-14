import { useChannels } from '../context/ChannelsContext'
import ChannelList from './ChannelList'

export default function Sidebar() {
  const { search, setSearch, groups, selectedGroup, setSelectedGroup, filtered } = useChannels()

  return (
    <aside style={{
      width: 268, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
    }}>

      {/* Search */}
      <div style={{ padding: '12px 12px 8px' }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}
            width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar canal..."
            style={{
              width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)',
              borderRadius: 9, padding: '8px 32px 8px 32px', fontSize: 13,
              color: 'var(--text1)', outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor='var(--accent)'}
            onBlur={e => e.target.style.borderColor='var(--border2)'}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position:'absolute', right:9, top:'50%', transform:'translateY(-50%)',
                width:18, height:18, borderRadius:'50%', background:'var(--border2)',
                border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              }}
            >
              <svg width="9" height="9" fill="none" stroke="var(--text2)" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      {groups.length > 1 && (
        <div style={{ display:'flex', gap:6, padding:'0 12px 8px', overflowX:'auto', scrollbarWidth:'none' }}>
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                flexShrink: 0, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: selectedGroup===g ? 'var(--accent)' : 'var(--bg)',
                color: selectedGroup===g ? '#fff' : 'var(--text3)',
                outline: selectedGroup===g ? 'none' : '1px solid var(--border2)',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Divider + count */}
      <div style={{ borderTop:'1px solid var(--border)', padding:'6px 14px', flexShrink:0 }}>
        <span style={{ fontSize:11, color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>
          {filtered.length} canales
        </span>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', padding:'4px 6px 8px' }}>
        <ChannelList />
      </div>
    </aside>
  )
}
