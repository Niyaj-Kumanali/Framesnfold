import { useHideOnScroll } from '../../hooks/useHideOnScroll'
import './Header.css'

const INSTAGRAM = 'https://www.instagram.com/framesnfold'
const INSTAGRAM_PERSONAL = 'https://www.instagram.com/nawaz_frames'
const YOUTUBE = 'https://www.youtube.com/@framesnfold'

/** Instagram: rounded frame, lens, flash. */
function InstagramMark() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle className="solid" cx="17.15" cy="6.85" r="1.05" />
    </svg>
  )
}

/** YouTube: rounded box, play triangle. */
function YouTubeMark() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="2.4" y="5.6" width="19.2" height="12.8" rx="4" />
      <path className="solid" d="M10.4 9.3 L15.2 12 L10.4 14.7 Z" />
    </svg>
  )
}

/**
 * The bar: wordmark and folding panel mark on the left, the accounts on the
 * right. It sticks, hides while scrolling down and returns on the way up, so
 * the hero stays the only thing on screen at rest.
 */
export default function Header() {
  const { hidden, stuck } = useHideOnScroll()

  const classes = ['bar-top']
  if (stuck) classes.push('is-stuck')
  if (hidden) classes.push('is-hidden')

  return (
    <header className={classes.join(' ')}>
      <a className="brand" href="#top" aria-label="framesnfold, back to top">
        {/* A frame that folds: cream panel, ember panel, hinged down the middle. */}
        <span className="mark" aria-hidden="true">
          <span className="panel" />
          <span className="panel hinge" />
        </span>
        <span className="brand-name">framesnfold</span>
      </a>

      <nav aria-label="Social accounts">
        <a
          className="acct"
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="framesnfold on Instagram"
          title="framesnfold on Instagram"
        >
          <InstagramMark />
        </a>
        <a
          className="acct personal"
          href={INSTAGRAM_PERSONAL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nawaz Kumanali's personal Instagram"
          title="Nawaz on Instagram (personal)"
        >
          <InstagramMark />
          {/* marks the second Instagram as the personal account */}
          <span className="badge" aria-hidden="true" />
        </a>
        <a
          className="acct"
          href={YOUTUBE}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="framesnfold on YouTube"
          title="framesnfold on YouTube"
        >
          <YouTubeMark />
        </a>
      </nav>
    </header>
  )
}
