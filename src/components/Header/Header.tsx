import { useRef } from 'react'
import { bookLink } from '../../config'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useHeaderHeight } from '../../hooks/useHeaderHeight'
import { useHideOnScroll } from '../../hooks/useHideOnScroll'
import AccountLinks from '../AccountLinks/AccountLinks'
import './Header.css'

/* Short label in the pill; the destination still follows the WhatsApp setting. */
const BOOKING = bookLink()

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
] as const

/** A centred glass pill: brand, section links, booking and the shared icons. */
export default function Header() {
  const pillRef = useRef<HTMLElement>(null)
  useHeaderHeight(pillRef)
  const { hidden, stuck } = useHideOnScroll()
  const active = useActiveSection()

  const classes = ['nav-pill']
  if (stuck) classes.push('is-stuck')
  if (hidden) classes.push('is-hidden')

  return (
    <header ref={pillRef} className={classes.join(' ')}>
      <a className="brand" href="#top" aria-label="framesnfold, back to top">
        {/* A frame that folds: cream panel, ember panel, hinged down the middle. */}
        <span className="mark" aria-hidden="true">
          <span className="panel" />
          <span className="panel hinge" />
        </span>
        <span className="brand-name">framesnfold</span>
      </a>

      <nav className="section-nav" aria-label="Sections">
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={active === item.id ? 'is-current' : undefined}
            aria-current={active === item.id ? 'location' : undefined}
          >
            {item.label}
          </a>
        ))}
        <a className="book-mini" href={BOOKING.href} target="_blank" rel="noopener noreferrer">
          Book a reel
        </a>
      </nav>

      <AccountLinks className="header-accounts" />
    </header>
  )
}
