import { projects } from '../data/profile';

export default function Projects() {
  return (
    <section id="projects" className="section section--alt">
      <div className="container">
        <div className="section__header">
          <h2>Projects</h2>
          <p>Highlights from my portfolio and recent work.</p>
        </div>
        <div className="grid">
          {projects.map((project) => (
            <article className="card" key={project.title}>
              {project.image ? (
                <img src={project.image} alt={`${project.title} preview`} />
              ) : (
                <div className="card__media">
                  <span>{project.title}</span>
                </div>
              )}
              <div className="card__body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <div className="card__footer">
                <span>{project.stack}</span>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener" className="btn btn--ghost">
                    View repo
                  </a>
                ) : (
                  <span className="tag">Private</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
