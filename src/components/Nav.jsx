import { useEffect, useRef, useState } from 'react';
import { navLinks, profile, socialLinks } from '../data/profile';

export default function Nav({ menuOpen, onToggle, onNavClick }) {
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef(0);
  const directionTravel = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const resetTravel = () => {
      scrollDirection.current = 0;
      directionTravel.current = 0;
    };

    const getMaxScrollY = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollHeight = Math.max(doc?.scrollHeight || 0, body?.scrollHeight || 0);
      const viewportHeight = Math.max(doc?.clientHeight || 0, window.innerHeight || 0);
      return Math.max(0, scrollHeight - viewportHeight);
    };

    const updateVisibility = () => {
      const isMobile = window.innerWidth <= 900;
      const maxScrollY = getMaxScrollY();
      const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const currentScrollRaw = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      const currentScroll = Math.min(currentScrollRaw, Math.max(maxScrollY, 0));

      if (!isMobile || menuOpen) {
        setNavHidden(false);
        resetTravel();
        lastScrollY.current = currentScroll;
        return;
      }

      const delta = currentScroll - lastScrollY.current;
      const TOP_SAFE_ZONE_PX = 32;
      const BOTTOM_SAFE_ZONE_MIN_PX = 108;
      const BOTTOM_SAFE_ZONE_RATIO = 0.2;
      const bottomSafeZonePx = Math.max(BOTTOM_SAFE_ZONE_MIN_PX, viewportHeight * BOTTOM_SAFE_ZONE_RATIO);
      const nearTop = currentScroll < TOP_SAFE_ZONE_PX;
      const nearBottom = maxScrollY - currentScroll <= bottomSafeZonePx;

      if (nearTop || nearBottom) {
        setNavHidden(false);
        resetTravel();
      } else if (Math.abs(delta) >= 0.5) {
        const direction = delta > 0 ? 1 : -1;

        if (direction !== scrollDirection.current) {
          scrollDirection.current = direction;
          directionTravel.current = 0;
        }
        directionTravel.current += Math.abs(delta);

        const HIDE_TRAVEL_PX = 18;
        const SHOW_TRAVEL_PX = 8;
        const MIN_HIDE_SCROLL_Y = 72;

        if (
          direction > 0 &&
          !nearBottom &&
          currentScroll > MIN_HIDE_SCROLL_Y &&
          directionTravel.current >= HIDE_TRAVEL_PX
        ) {
          setNavHidden(true);
          directionTravel.current = 0;
        } else if (direction < 0 && directionTravel.current >= SHOW_TRAVEL_PX) {
          setNavHidden(false);
          directionTravel.current = 0;
        } else if (direction < 0 && Math.abs(delta) >= 1.8) {
          // Reveal quickly on deliberate upward scroll to avoid sticky-hidden states on mobile.
          setNavHidden(false);
          directionTravel.current = 0;
        }
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
