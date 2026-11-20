import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import Dust from './components/Dust'
import Icon from './components/Icon'
import Monogram from './components/Monogram'
import { HERO_IMAGE, LINKS, PROJECTS, SERVICES } from './data/site'
import { LAYER_STOPS, cardStops, sampleLayer, serviceStops } from './motion'
import type { MotionStop } from './motion'
import './App.css'

function stopsFor(key: string): MotionStop[] | undefined {
  if (key.startsWith('card-')) return cardStops(Number(key.slice(5)))
  if (key.startsWith('service-')) return serviceStops(Number(key.slice(8)))
  return LAYER_STOPS[key]
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const stage = document.querySelector<HTMLElement>('.stage')
    const rail = document.querySelector<HTMLElement>('.progress-fill')
    if (!stage) return

    const layers = Array.from(stage.querySelectorAll<HTMLElement>('[data-layer]'))

    const render = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0

      for (const layer of layers) {
        const stops = stopsFor(layer.dataset.layer ?? '')
        if (!stops) continue

        const state = sampleLayer(stops, progress)
        layer.style.transform =
          `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, ${state.z.toFixed(2)}px) ` +
          `rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg) ` +
          `rotateZ(${state.rz.toFixed(2)}deg) scale(${state.scale.toFixed(3)})`
        layer.style.opacity = state.opacity.toFixed(3)
        layer.style.filter = state.blur > 0.01 ? `blur(${state.blur.toFixed(2)}px)` : 'none'
        layer.style.pointerEvents = state.opacity > 0.6 ? 'auto' : 'none'
      }

      if (rail) rail.style.transform = `scaleX(${progress.toFixed(4)})`
    }

    render()
    window.addEventListener('scroll', render, { passive: true })
    window.addEventListener('resize', render)

    return () => {
      window.removeEventListener('scroll', render)
      window.removeEventListener('resize', render)
    }
  }, [])

  return (
    <div className="app">
      <div className="scroll-track" aria-hidden="true" />

      <div className="stage">
        <div className="ambient" data-layer="ambient" aria-hidden="true" />
        <Dust />

        <section className="layer layer--title" data-layer="title" aria-labelledby="title-name">
          <span className="hero-grid" aria-hidden="true" />
          <span className="hero-rings" aria-hidden="true" />
          <span className="hero-streak hero-streak--one" aria-hidden="true" />
          <span className="hero-streak hero-streak--two" aria-hidden="true" />
          <span className="hero-node hero-node--one" aria-hidden="true" />
          <span className="hero-node hero-node--two" aria-hidden="true" />
          <span className="hero-frame" aria-hidden="true" />
          <span className="hero-label hero-label--tl" aria-hidden="true">
            <Monogram className="hero-mini-mark" /> framesnfold
          </span>
          <span className="hero-label hero-label--tr" aria-hidden="true">Reels · Edits · Shoots</span>
          <span className="hero-label hero-label--bl" aria-hidden="true">Selected work / 01–06</span>
          <span className="hero-label hero-label--br" aria-hidden="true">Scroll to explore</span>

          <div className="title-inner">
            <div className="title-copy">
              <p className="hero-identity">REELS&nbsp;&nbsp;•&nbsp;&nbsp;EDITS&nbsp;&nbsp;•&nbsp;&nbsp;SHOOTS</p>
              <h1 id="title-name">Nawaz Kumanali</h1>
              <p className="hero-capabilities">
                <span>SHOOT</span><i aria-hidden="true">|</i><span>EDIT</span><i aria-hidden="true">|</i><span>REEL</span>
              </p>
              <p className="hero-description">
                Turning raw footage into sharp reels, edits and shoots that move people.
              </p>
              <div className="hero-actions">
                <a className="cta cta--primary" href="#" aria-label="View my resume — placeholder link">
                  <Icon className="cta-icon" name="briefcase" /> VIEW MY RESUME
                </a>
                <a
                  className="cta cta--secondary"
                  href={LINKS.dm}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="cta-icon" name="mail" /> CONTACT ME
                </a>
              </div>
            </div>
          </div>

          <div
            className="title-portrait"
            data-layer="portrait"
            style={{
              '--portrait-image': `url(${HERO_IMAGE})`,
              '--portrait-ratio': '938 / 1257',
            } as CSSProperties}
          >
            <span className="portrait-halo" aria-hidden="true" />
            <span className="portrait-shoulder-glow" aria-hidden="true" />
            <span className="portrait-rim" aria-hidden="true" />
            <span className="portrait-ground" aria-hidden="true" />
            <img src={HERO_IMAGE} alt="Nawaz Kumanali" />
          </div>
        </section>

        <section className="layer layer--work" data-layer="work" aria-labelledby="work-title">
          <div className="work-wrap">
            <p className="kicker">02 / Portfolio</p>
            <h2 className="work-title" id="work-title">Selected work</h2>
            <div className="work-grid">
              {PROJECTS.map((project, index) => (
                <a
                  key={project.id}
                  className="work-card"
                  data-layer={`card-${index}`}
                  href={LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.title} on Instagram`}
                >
                  <span className="card-index">{project.index}</span>
                  <span className="card-title">{project.title}</span>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="layer layer--closeup" data-layer="closeup" aria-labelledby="closeup-title">
          <div className="closeup-frame">
            <div className="closeup-visual">
              <Monogram className="closeup-mark" />
              <span>01 / 06</span>
            </div>
            <div className="closeup-copy">
              <p className="kicker">Selected frame</p>
              <h2 id="closeup-title">Frame 01</h2>
              <p>Placeholder caption. The final clip lands here once the media is ready.</p>
            </div>
          </div>
        </section>

        <section className="layer layer--services" data-layer="services" aria-labelledby="services-title">
          <div className="services-wrap">
            <p className="kicker" id="services-title">Services</p>
            <div className="services-grid">
              {SERVICES.map((service, index) => (
                <article className="service-panel" data-layer={`service-${index}`} key={service.id}>
                  <span className="service-index">0{index + 1}</span>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="layer layer--contact" data-layer="contact" aria-labelledby="contact-title">
          <div className="contact-inner">
            <Monogram className="contact-mark" />
            <p className="kicker">Contact</p>
            <h2 id="contact-title">Let&rsquo;s make something move.</h2>
            <p>Tell me what you need and I&rsquo;ll take it from there.</p>
            <a className="cta" href={LINKS.dm} target="_blank" rel="noreferrer">
              Message Nawaz <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </div>

      <div className="progress-rail" aria-hidden="true">
        <span className="progress-fill" />
      </div>
    </div>
  )
}
