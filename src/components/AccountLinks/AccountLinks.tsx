import { LINKS } from '../../config'
import './AccountLinks.css'

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

/** The same three icon links in the header and the footer. */
export default function AccountLinks({ className = '' }: { className?: string }) {
  return (
    <nav className={['account-links', className].filter(Boolean).join(' ')} aria-label="Social accounts">
      <a
        className="acct"
        href={LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="framesnfold on Instagram"
        title="framesnfold on Instagram"
      >
        <InstagramMark />
      </a>
      <a
        className="acct personal"
        href={LINKS.instagramPersonal}
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
        href={LINKS.youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="framesnfold on YouTube"
        title="framesnfold on YouTube"
      >
        <YouTubeMark />
      </a>
    </nav>
  )
}
