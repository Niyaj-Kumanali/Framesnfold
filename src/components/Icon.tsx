type IconName = 'briefcase' | 'mail'

type IconProps = {
  name: IconName
  className?: string
}

export default function Icon({ name, className }: IconProps) {
  if (name === 'briefcase') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
