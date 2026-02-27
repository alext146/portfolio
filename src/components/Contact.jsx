import { useState } from 'react';
import { socialLinks } from '../data/profile';
import { buildFormUrl, initialFormValues } from '../utils/forms';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setStatus('Sending...');
    try {
      const url = buildFormUrl(formValues);
      await fetch(url.toString(), { method: 'POST', mode: 'no-cors' });
      setStatus('Message sent!');
      setFormValues(initialFormValues);
    } catch (error) {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="section section--alt">
      <div className="container">
        <div className="section__header section__header--contact">
          <h2>Contact</h2>
          <p>Let's connect - new projects, collaborations, or just a quick hello.</p>
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
            <button className="btn btn--ghost" type="submit" disabled={isSending}>
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
            <p>Check out my latest work on GitHub.</p>
            <div className="contact__links">
              <a className="btn btn--ghost" href={socialLinks.github} target="_blank" rel="noopener">
                GitHub
              </a>
            </div>
            <p className="muted">Resume available upon request.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
