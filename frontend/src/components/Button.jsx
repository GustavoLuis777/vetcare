import { Spinner } from './Spinner'

export function Button({ children, onClick, variant = 'primary', loading, fullWidth, type = 'button' }) {
  const base = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '13px 24px', borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
    fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all 0.2s', width: fullWidth ? '100%' : 'auto',
    opacity: loading ? 0.8 : 1,
  }
  const variants = {
    primary: { background: 'var(--primary)', color: 'white' },
    accent:  { background: 'var(--accent)',  color: 'white' },
    ghost:   { background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--border)' },
  }
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...variants[variant] }}>
      {loading ? <Spinner /> : children}
    </button>
  )
}
