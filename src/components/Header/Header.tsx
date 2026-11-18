import { useRef } from 'react'
import { bookLink } from '../../config'
import AccountLinks from '../AccountLinks/AccountLinks'
import { useHeaderHeight } from '../../hooks/useHeaderHeight'
import { useHideOnScroll } from '../../hooks/useHideOnScroll'
import './Header.css'

/* Short label in the bar; the destination still follows the WhatsApp setting. */
const BOOKING = bookLink()

/**
 * The bar: wordmark and folding panel mark on the left, section links and the
 * accounts on the right. It sticks, hides while scrolling down and returns on
 * the way up, so the hero keeps the same quiet first screen as before.
 */
export default function Header() {
  const barRef = useRef<HTMLElement>(null)
  useHeaderHeight(barRef)
  const { hidden, stuck } = useHideOnScroll()

  const classes = ['bar-top']
  if (stuck) classes.push('is-stuck')
  if (hidden) classes.push('is-hidden')

  return (
    <header ref={barRef} className={classes.join(' ')}>
      <a className="brand" href="#top" aria-label="framesnfold, back to top">
        {/* A frame that folds: cream panel, ember panel, hinged down the middle. */}
        <span className="mark" aria-hidden="true">
          <span className="panel" />
          <span className="panel hinge" />
        </span>
        <span className="brand-name">framesnfold</span>
      </a>

      <nav className="section-nav" aria-label="Sections">
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a
          className="book-mini"
          href={BOOKING.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a reel
        </a>
      </nav>

      <AccountLinks className="header-accounts" />
    </header>
  )
}
