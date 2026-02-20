import { capabilities, profile, skillGroups } from '../data/profile';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section__header">
          <h2>About</h2>
          <p>{profile.aboutDescription}</p>
        </div>
        <div className="about">
          <div>
            <h3>What I do</h3>
            <ul>
              <li>Ship responsive, real-time web interfaces with clean UX</li>
              <li>Modernize front-end architectures and component systems</li>
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
  );
}
