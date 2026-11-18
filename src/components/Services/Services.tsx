import { bookLink } from '../../config'
import { PRICE_TEXT } from '../../data/prices'
import './Services.css'

/* WhatsApp when configured, an Instagram DM until then. */
const BOOKING = bookLink()

/** Two blocks of deliberately different weight: the shop offer leads. */
export default function Services() {
  return (
    <section id="services" className="section services-section">
      <h2>What it costs</h2>
      <p className="services-context">Most reels are ready in 1 to 2 days.</p>

      <div className="services-layout">
        <article className="service-primary">
          <h3>Reels for your shop</h3>
          <p className="service-price">{PRICE_TEXT.shopLine}</p>
          <ul className="service-list">
            <li>2 reels shot at your shop</li>
            <li>2 AI reels, no shoot needed</li>
            <li>Shop openings, offers, new stock, festival sales</li>
            <li>Ready in 1 to 2 days</li>
          </ul>
          <a className="btn primary" href={BOOKING.href} target="_blank" rel="noopener noreferrer">
            Book this package
          </a>
        </article>

        <article className="service-secondary">
          <h3>Edits for bike, car and personal pages</h3>
          <p className="service-text">{PRICE_TEXT.editLine}</p>
          <a className="btn ghost" href={BOOKING.href} target="_blank" rel="noopener noreferrer">
            Ask about an edit
          </a>
        </article>
      </div>

      <p className="services-note">
        Prices start at these numbers and depend on length and shooting.
      </p>
    </section>
  )
}
