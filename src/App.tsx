import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Work from './components/Work/Work'

export default function App() {
  return (
    <div className="app" id="top">
      <Header />
      <Hero />

      <Work />

      {/* Filled in by the remaining tasks. */}
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
