import { useEffect, useRef, useState } from 'react';
import { navLinks, profile, socialLinks } from '../data/profile';

export default function Nav({ menuOpen, onToggle, onNavClick }) {
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateVisibility = () => {
      const isMobile = window.innerWidth <= 900;
      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (!isMobile || menuOpen) {
        setNavHidden(false);
        lastScrollY.current = currentScroll;
        return;
      }

      const delta = currentScroll - lastScrollY.current;
      const nearTop = currentScroll < 24;

      if (nearTop) {
        setNavHidden(false);
      } else if (delta > 8) {
        setNavHidden(true);
      } else if (delta < -8) {
        setNavHidden(false);
      }

      lastScrollY.current = currentScroll;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        updateVisibility();
        ticking.current = false;
      });
    };

    updateVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [menuOpen]);

  return (
    <header className={`nav${navHidden ? ' nav--hidden' : ''}`}>
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
        </div>
      </div>
    </header>
  );
}
