import { capabilities, profile, skillGroups } from '../data/profile';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section__header section__header--about">
          <h2>About</h2>
        </div>
        <article className="about-intro">
          <p>{profile.aboutDescription}</p>
          <p className="about-intro__credential">{profile.aboutCredential}</p>
        </article>
        <div className="about">
          <article className="about-card">
            <h3>What I do</h3>
            <ul className="about-list">
              <li>Ship responsive, real-time web interfaces with clean UX</li>
              <li>Modernize front-end architectures and component systems</li>
              <li>Deliver stable, testable features with CI/CD pipelines</li>
            </ul>
          </article>
          <article className="about-card">
            <h3>Capabilities</h3>
            <ul className="about-list">
              {capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="about-card about-card--skills">
            <h3>Skills</h3>
            <div className="skill-groups">
              {skillGroups.map((group) => (
                <article className="skill-group" key={group.title}>
                  <span className="skill-group__title">{group.title}</span>
                  <div className="chip-grid">
                    {group.items.map((skill) => (
                      <span className="chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
