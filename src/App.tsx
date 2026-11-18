import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Services from './components/Services/Services'
import Work from './components/Work/Work'

export default function App() {
  return (
    <div className="app" id="top">
      <Header />
      <Hero />

      <Work />

      <Services />

      {/* Filled in by the remaining tasks. */}
      <section id="about" className="section section-placeholder">
        <h2>Hi, I'm Nawaz.</h2>
      </section>
      <section id="contact" className="section section-placeholder">
        <h2>Tell us about your shop.</h2>
      </section>
    </div>
  )
}
