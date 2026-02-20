import { navLinks, profile, socialLinks } from '../data/profile';

export default function Nav({ menuOpen, onToggle, onNavClick }) {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#top">
          {profile.name}
        </a>
        <button
          className="nav__toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={onToggle}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav id="primary-navigation" className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={onNavClick}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <a className="btn btn--ghost" href={socialLinks.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <a className="btn" href={socialLinks.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  );
}
