import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'

export default function App() {
  return (
    <div className="app" id="top">
      <Header />
      <Hero />

      {/* The next four tasks fill these in. Their ids are here from the start
          so the header links and the hero CTA can scroll to them now. */}
      <section id="work" className="section section-placeholder">
        <h2>Recent work</h2>
      </section>
      <section id="services" className="section section-placeholder">
        <h2>What it costs</h2>
      </section>
      <section id="about" className="section section-placeholder">
        <h2>Hi, I'm Nawaz.</h2>
      </section>
      <section id="contact" className="section section-placeholder">
        <h2>Tell us about your shop.</h2>
      </section>
    </div>
  )
}
