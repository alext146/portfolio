import { blogPosts } from '../data/profile';

export default function Blog() {
  return (
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
  );
}
