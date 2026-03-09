export function PawIcon({ size = 24, color = 'var(--accent)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <ellipse cx="12" cy="17" rx="5" ry="4" />
      <ellipse cx="7" cy="11.5" rx="2" ry="2.5" />
      <ellipse cx="17" cy="11.5" rx="2" ry="2.5" />
      <ellipse cx="9.5" cy="8" rx="1.8" ry="2.2" />
      <ellipse cx="14.5" cy="8" rx="1.8" ry="2.2" />
    </svg>
  )
}
