import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="dev-footer">
      <div className="dev-footer__glow" />
      <div className="dev-footer__inner">
        <section className="dev-footer__brand">
          <Link to="/" className="dev-footer__wordmark">
            DevTinder<span>·</span>
          </Link>
          <p>A quieter place to find the people you&apos;ll build with next.</p>
        </section>

        <div className="dev-footer__signal" aria-hidden="true">
          <svg viewBox="0 0 520 86" fill="none">
            <path
              className="dev-footer__path"
              d="M2 49C61 49 55 20 117 20C177 20 167 67 235 67C301 67 300 33 365 33C429 33 429 49 518 49"
            />
            <circle
              className="dev-footer__node dev-footer__node--one"
              cx="117"
              cy="20"
              r="5"
            />
            <circle
              className="dev-footer__node dev-footer__node--two"
              cx="235"
              cy="67"
              r="5"
            />
            <circle
              className="dev-footer__node dev-footer__node--three"
              cx="365"
              cy="33"
              r="5"
            />
          </svg>
          <span>good things happen between nodes</span>
        </div>

        <nav className="dev-footer__links" aria-label="Footer navigation">
          <Link to="/">Discover</Link>
          <Link to="/connections">Connections</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </div>

      <div className="dev-footer__meta">
        <span>© {new Date().getFullYear()} DevTinder</span>
        <span>Designed for thoughtful collaboration</span>
      </div>
    </footer>
  );
};

export default Footer;
