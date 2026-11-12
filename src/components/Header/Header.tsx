import './Header.css'

export default function Header() {
  return (
    <header className="bar-top">
      <span className="who">Nawaz Kumanali</span>
      <nav aria-label="Instagram accounts">
        <a href="https://www.instagram.com/framesnfold" target="_blank" rel="noopener noreferrer">
          @framesnfold
        </a>
        <a href="https://www.instagram.com/nawaz_frames" target="_blank" rel="noopener noreferrer">
          @nawaz_frames
        </a>
      </nav>
    </header>
  )
}
