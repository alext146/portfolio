import { experience } from '../data/profile';

export default function Experience() {
  return (
    <section id="experience" className="section section--alt">
      <div className="container">
        <div className="section__header">
          <h2>Research & Leadership</h2>
          <p>Applied research and delivery leadership in security-focused mobile systems.</p>
        </div>
        <div className="experience">
          {experience.map((item) => (
            <article className="card" key={item.title}>
              <div className="card__body">
                <div className="experience__header">
                  <div>
                    <h3>{item.title}</h3>
                    <span className="muted">{item.org}</span>
                  </div>
                  <span className="tag">{item.dates}</span>
                </div>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
