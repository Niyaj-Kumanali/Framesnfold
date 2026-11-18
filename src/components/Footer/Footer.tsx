import AccountLinks from '../AccountLinks/AccountLinks'
import './Footer.css'

/** One quiet row: the name, the same three icons, the year. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-wordmark">framesnfold</span>
      <AccountLinks className="footer-accounts" />
      <span className="footer-copy">© 2026 framesnfold</span>
    </footer>
  )
}
