import { profile } from '../data/profile';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <span>© {year} {profile.name}. All rights reserved.</span>
        <span className="footer__meta">Built with React + Vite</span>
      </div>
    </footer>
  );
}
