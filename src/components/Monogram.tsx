type MonogramProps = {
  className?: string
}

export default function Monogram({ className }: MonogramProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="framesnfold monogram"
      focusable="false"
    >
      <rect x="6" y="6" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="2" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="Anton, Arial Narrow, sans-serif"
        fontSize="22"
        fill="currentColor"
      >
        NK
      </text>
      <path d="M8 56 L56 8" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}
