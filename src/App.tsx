import About from './components/About/About'
import Background from './components/Background/Background'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Services from './components/Services/Services'
import Work from './components/Work/Work'

export default function App() {
  return (
    <div className="app" id="top">
      <Background />
      <Header />
      <Hero />
      <Work />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}
