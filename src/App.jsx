import { useState } from 'react';
import Nav from './components/Nav';
import MarsBackground from './components/MarsBackground';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <div className="app">
      <MarsBackground />
      <Nav
        menuOpen={menuOpen}
        onToggle={() => setMenuOpen((open) => !open)}
        onNavClick={handleNavClick}
      />
      <main>
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
