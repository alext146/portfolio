import { useMemo, useState } from 'react';

const formId = '1FAIpQLSc03o2glNj2DpuipxJsfqdZcU-UpCpzeu7-x8m1lGv0DD87-w';
const entryMap = {
  name: 'entry.791343280',
  email: 'entry.847895956',
  subject: 'entry.1249386301',
  message: 'entry.2073569407'
};

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' }
];

const projects = [
  {
    title: 'War Empathy',
    description:
      'An HTML-based RPG with minimal CSS styling to bring awareness to geopolitical crises.',
    stack: 'HTML, CSS',
    link: 'https://github.com/adtrahan146/war-emp',
    image: '/assets/waremp.png'
  },
  {
    title: 'End Game Maps',
    description:
      'Full stack map app using Leaflet.js and user-generated pins. Early full‑stack milestone.',
    stack: 'JavaScript',
    link: 'https://github.com/adtrahan146/EndGameMaps',
    image: '/assets/7115707.jpg'
  },
  {
    title: 'Rock, Paper, Scissors',
    description: 'A small rock/paper/scissors single‑page app using DOM events.',
    stack: 'JavaScript',
    link: 'https://github.com/adtrahan146/RockPaperScissors',
    image: '/assets/rockpaperscissorsicon.png'
  },
  {
    title: "The People's Insight",
    description:
      "News app that pulls the day's top posts from various news subreddits.",
    stack: 'JavaScript',
    link: 'https://github.com/adtrahan146/the-peoples-insight',
    image: '/assets/peoples.png'
  }
];

const blogPosts = [
  {
    title: 'Portfolio Website Devlog',
    subtitle: 'Notes from building this portfolio site.',
    link: 'https://docs.google.com/document/d/1OxFO_R4YZP1QzMNrB0sCyI87syE3TAy_kpWyo8SOU0k/edit?usp=sharing',
    image: '/assets/uno.jpg'
  },
  {
    title: 'EndGameMaps Announcement',
    subtitle: 'Full‑stack map application overview.',
    link: 'https://docs.google.com/document/d/1oj_e-kd38ggQmj2Wall5zBMYDalq_x8YiLDmpq7b-tE/edit?usp=sharing',
    image: '/assets/7115707.jpg'
  },
  {
    title: 'RockPaperScissors Devlog',
    subtitle: 'Quick build log for the RPS mini‑app.',
    link: 'https://docs.google.com/document/d/19n0ggmBQJdqIEKKHmK_aFBFLt4RfmzJUzTo4D_qUBKo/edit?usp=sharing',
    image: '/assets/rock-paper-scissors.png'
  },
  {
    title: 'Russian Revolution Research',
    subtitle: 'Research paper written during my Political Science studies.',
    link: 'https://docs.google.com/document/d/1qPNUk5y2OdoBan4WULltoVwxgttHU7Nrv7F1-n-MaBc/edit?usp=sharing',
    image: '/assets/imperial-flag.jpg'
  }
];

const capabilities = [
  'Modernizing front‑end architectures and component libraries',
  'Responsive, real‑time interfaces for high‑reliability systems',
  'Performance and stability for control‑system / embedded‑adjacent platforms'
];

const skillGroups = [
  {
    title: 'Frontend',
    items: ['React', 'JavaScript', 'React Native', 'HTML/CSS']
  },
  {
    title: 'Backend',
    items: ['Node.js', 'PHP', 'Java', 'MySQL']
  },
  {
    title: 'DevOps',
    items: ['AWS', 'Docker', 'CI/CD (Jenkins)']
  },
  {
    title: 'Quality + Tools',
    items: ['Git', 'Jest', 'TDD', 'Atlassian', 'Linux', 'WSL2']
  }
];

const buildFormUrl = (values) => {
  const url = new URL(`https://docs.google.com/forms/d/e/${formId}/formResponse`);
  Object.entries(entryMap).forEach(([key, entry]) => {
    url.searchParams.set(entry, values[key] ?? '');
  });
  return url;
};

export default function App() {
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const heroStats = useMemo(
    () => [
      { label: 'Focus', value: 'Real‑time web interfaces' },
      { label: 'Stack', value: 'React + Node.js' },
      { label: 'Availability', value: 'Open to opportunities' }
    ],
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavClick = () => setMenuOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setStatus('Sending...');
    try {
      const url = buildFormUrl(formValues);
      await fetch(url.toString(), { method: 'POST', mode: 'no-cors' });
      setStatus('Message sent!');
      setFormValues({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="app">
      <header className="nav">
        <div className="container nav__inner">
          <a className="nav__brand" href="#top">
            Alex Trahan
          </a>
          <button
            className="nav__toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <nav
            id="primary-navigation"
            className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={handleNavClick}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="nav__actions">
            <a className="btn btn--ghost" href="https://github.com/adtrahan146" target="_blank" rel="noopener">
              GitHub
            </a>
            <a className="btn" href="https://www.linkedin.com/in/alext146/" target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="top" className="hero">
          <div className="container hero__inner">
            <div className="hero__content">
              <span className="pill">Software developer</span>
              <h1>
                Building web apps and interactive experiences
                <span className="accent">.</span>
              </h1>
              <p>
                Skilled in modernizing front-end architectures and building responsive, real-time interfaces for high-reliability systems. Comfortable in performance- and stability-critical environments, including control systems and embedded-adjacent platforms.
              </p>
              <div className="hero__cta">
                <a className="btn" href="#projects">View projects</a>
                <a className="btn btn--ghost" href="#contact">Get in touch</a>
              </div>
              <div className="hero__stats">
                {heroStats.map((item) => (
                  <div className="stat" key={item.label}>
                    <span className="stat__label">{item.label}</span>
                    <span className="stat__value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero__card">
              <img src="/assets/profile-image.png" alt="Alex portrait" />
              <div className="hero__card-text">
                <strong>Alex Trahan</strong>
                <span>Web + interactive developer</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <div className="section__header">
              <h2>About</h2>
              <p>
                Proficient in React, JavaScript, Node.js, PHP, Java, React Native, Linux/WSL2, AWS, Docker, MySQL, Git,
                CI/CD (Jenkins), Jest, TDD, and Atlassian tools. B.S. Computer Science — Certified in Software Engineering
                (University of New Orleans).
              </p>
            </div>
            <div className="about">
              <div>
                <h3>What I do</h3>
                <ul>
                  <li>Ship responsive, real‑time web interfaces with clean UX</li>
                  <li>Modernize front‑end architectures and component systems</li>
                  <li>Deliver stable, testable features with CI/CD pipelines</li>
                </ul>
              </div>
              <div>
                <h3>Capabilities</h3>
                <ul>
                  {capabilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Skills</h3>
                <div className="skill-groups">
                  {skillGroups.map((group) => (
                    <div className="skill-group" key={group.title}>
                      <span className="skill-group__title">{group.title}</span>
                      <div className="chip-grid">
                        {group.items.map((skill) => (
                          <span className="chip" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section section--alt">
          <div className="container">
            <div className="section__header">
              <h2>Projects</h2>
              <p>Highlights from my portfolio and recent work.</p>
            </div>
            <div className="grid">
              {projects.map((project) => (
                <article className="card" key={project.title}>
                  <img src={project.image} alt={`${project.title} preview`} />
                  <div className="card__body">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="card__footer">
                    <span>{project.stack}</span>
                    <a href={project.link} target="_blank" rel="noopener" className="btn btn--ghost">
                      View repo
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="section">
          <div className="container">
            <div className="section__header">
              <h2>Writing & Research</h2>
              <p>Notes, devlogs, and research writing.</p>
            </div>
            <div className="grid grid--wide">
              {blogPosts.map((post) => (
                <article className="card" key={post.title}>
                  <img src={post.image} alt={`${post.title} cover`} />
                  <div className="card__body">
                    <h3>{post.title}</h3>
                    <p>{post.subtitle}</p>
                  </div>
                  <div className="card__footer">
                    <a href={post.link} target="_blank" rel="noopener" className="btn btn--ghost">
                      Read more
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section section--alt">
          <div className="container">
            <div className="section__header">
              <h2>Contact</h2>
              <p>Let’s connect—new projects, collaborations, or just a quick hello.</p>
            </div>
            <div className="contact">
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" value={formValues.name} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" value={formValues.subject} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formValues.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button className="btn" type="submit" disabled={isSending}>
                  {isSending ? 'Sending…' : 'Send message'}
                </button>
                {status && (
                  <span className="status" role="status" aria-live="polite">
                    {status}
                  </span>
                )}
              </form>
              <div className="contact__card">
                <h3>Find me online</h3>
                <p>Reach out through LinkedIn or check out my latest code on GitHub.</p>
                <div className="contact__links">
                  <a className="btn btn--ghost" href="https://github.com/adtrahan146" target="_blank" rel="noopener">
                    GitHub
                  </a>
                  <a className="btn" href="https://www.linkedin.com/in/alext146/" target="_blank" rel="noopener">
                    LinkedIn
                  </a>
                </div>
                <p className="muted">Resume available upon request.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Alex Trahan</span>
          <span>Built with React + Vite</span>
        </div>
      </footer>
    </div>
  );
}
