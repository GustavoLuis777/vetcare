export function Spinner() {
  return (
    <div style={{
      width: 18, height: 18,
      border: '2.5px solid rgba(255,255,255,0.4)',
      borderTop: '2.5px solid white',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block'
    }} />
  )
}
