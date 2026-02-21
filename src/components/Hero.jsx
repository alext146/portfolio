import { heroStats, profile } from '../data/profile';

export default function Hero() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="pill">{profile.role}</span>
          <h1>
            {profile.tagline}
            <span className="accent">.</span>
          </h1>
          <p>{profile.heroDescription}</p>
          <div className="hero__cta">
            <a className="btn" href="#projects">View projects</a>
            <a className="btn btn--ghost" href="#contact">Get in touch</a>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__card">
            <img src={`${baseUrl}assets/profile-image.png`} alt="Alex portrait" />
            <div className="hero__card-text">
              <strong>{profile.name}</strong>
              <span>{profile.stackLine}</span>
            </div>
          </div>
          <div className="hero__stats hero__stats--visual">
            {heroStats.map((item) => (
              <div className="stat" key={item.label}>
                <span className="stat__label">{item.label}</span>
                <span className="stat__value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
