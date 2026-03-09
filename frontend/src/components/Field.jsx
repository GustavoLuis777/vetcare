export function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label>{label}</label>
      {children}
      {error && <span style={{ color: 'var(--error)', fontSize: 12, marginTop: 4 }}>{error}</span>}
    </div>
  )
}
