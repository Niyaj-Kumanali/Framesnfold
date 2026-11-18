import { useState } from 'react'
import './About.css'

/** The photo is Niyaj's to add at public/nawaz.jpg; a drawn panel stands in. */
export default function About() {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <section id="about" className="section about-section">
      <div className="about-layout">
        <div className="about-photo">
          {photoFailed ? (
            <div className="about-placeholder" role="img" aria-label="Nawaz Kumanali">
              <span aria-hidden="true">N</span>
            </div>
          ) : (
            <img
              src="/nawaz.jpg"
              alt="Nawaz Kumanali"
              width={640}
              height={800}
              loading="lazy"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>

        <div className="about-copy">
          <h2>Hi, I'm Nawaz.</h2>
          {/* PLACEHOLDER COPY: swap for Nawaz's own words when he has them. */}
          <p>
            I shoot and edit short reels for local shops, and bike and car pages. framesnfold is my
            studio, and I started it recently, so every project gets my full attention.
          </p>
        </div>
      </div>
    </section>
  )
}
