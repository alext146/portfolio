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
    let cleanupTimeout = 0;

    const rafId = window.requestAnimationFrame(() => {
      if (cancelled) return;
      cleanupTimeout = window.setTimeout(() => {
        if (!cancelled) setShowOceanBackground(true);
      }, 0);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(cleanupTimeout);
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
