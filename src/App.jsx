import { useState } from 'react';
import Nav from './components/Nav';
import OceanBackground from './components/OceanBackground';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <div className="app">
      <OceanBackground />
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
