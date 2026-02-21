import { lazy, Suspense, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

const OceanBackground = lazy(() => import('./components/OceanBackground'));

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOceanBackground, setShowOceanBackground] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  useEffect(() => {
    let cancelled = false;

    const revealBackground = () => {
      if (!cancelled) setShowOceanBackground(true);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(revealBackground, { timeout: 1500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(revealBackground, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="app">
      {showOceanBackground ? (
        <Suspense fallback={null}>
          <OceanBackground />
        </Suspense>
      ) : null}
      <Nav
        menuOpen={menuOpen}
        onToggle={() => setMenuOpen((open) => !open)}
        onNavClick={handleNavClick}
      />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
