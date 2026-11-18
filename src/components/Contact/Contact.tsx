import { useState } from 'react'
import { bookLink, LINKS } from '../../config'
import './Contact.css'

/* WhatsApp when a number is configured, an Instagram DM until then. */
const BOOKING = bookLink()
const number = LINKS.whatsappNumber.replace(/\D/g, '')
const hasWhatsapp = number.length > 0

type CopyState = 'idle' | 'copied' | 'failed'

export default function Contact() {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  /* The call stays in the click handler: clipboard access needs the gesture. */
  const copyNumber = () => {
    navigator.clipboard.writeText(number).then(
      () => setCopyState('copied'),
      () => setCopyState('failed'),
    )
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-inner">
        <h2>Tell us about your shop.</h2>
        <p>Send what you sell and when you need the reels. Most are ready in 1 to 2 days.</p>

        <div className="contact-actions">
          <a className="btn primary" href={BOOKING.href} target="_blank" rel="noopener noreferrer">
            {BOOKING.label}
          </a>
          {hasWhatsapp && (
            <a
              className="btn ghost"
              href="https://ig.me/m/framesnfold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Message on Instagram
            </a>
          )}
        </div>

        {hasWhatsapp && (
          <div className="contact-number">
            <span className="contact-number-value">{number}</span>
            <button type="button" className="contact-copy" onClick={copyNumber}>
              {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Select the number' : 'Copy number'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
