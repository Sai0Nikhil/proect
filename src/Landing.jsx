// Landing.jsx
import Auth from './auth.jsx';
import './auth.css'; // this already contains .landing-* styles

function Landing({ onAuthSuccess }) {
  return (
    <div className="landing-shell">
      <div className="landing-bg-pattern" />

      {/* Top nav */}
      <header className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-icon"></span>
          <span className="landing-logo-text">Knowledge Portal</span>
        </div>

        <button
          type="button"
          className="landing-nav-btn"
          onClick={() => {
            const el = document.getElementById('landing-auth');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Login / Sign up
        </button>
      </header>

      {/* Hero + Auth side-by-side */}
      <main className="landing-hero">
        {/* Left: text */}
        <section>
          <p className="landing-eyebrow">For students, librarians, and staff</p>
          <h1 className="landing-headline">
            Turn your library into a <em>smart</em> knowledge hub.
          </h1>
          <p className="landing-subtext">
            Explore curated sections like Literature, History, and Science with
            rich summaries, key themes, and role-based dashboards.
          </p>

          <div className="landing-cta-group">
            <button
              type="button"
              className="landing-cta-primary"
              onClick={() => {
                const el = document.getElementById('landing-auth');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get started now
            </button>
            <span className="landing-cta-note">
            
            </span>
          </div>
        </section>

        {/* Right: visual + auth card */}
        <aside className="landing-hero-visual" id="landing-auth">
          {/* Optional floating cards visual removed for brevity, you can add later */}
          <div className="auth-card">
            <div className="auth-header">
              <h1>Sign in to continue</h1>
            </div>

            {/* Your existing Auth form */}
            <Auth onAuthSuccess={onAuthSuccess} />
          </div>
        </aside>
      </main>

      {/* Simple features section */}
      <section className="landing-features">
        <article className="landing-feature-card">
          <span className="lf-icon"></span>
          <h3 className="lf-title">Student portal</h3>
          <p className="lf-desc">
            Browse summaries, themes, and quotes across literature, history, and science.
          </p>
        </article>
        <article className="landing-feature-card">
          <span className="lf-icon"></span>
          <h3 className="lf-title">Librarian tools</h3>
          <p className="lf-desc">
            Manage catalog data and review resource details in one clean interface.
          </p>
        </article>
        <article className="landing-feature-card">
          <span className="lf-icon"></span>
          <h3 className="lf-title">Staff dashboard</h3>
          <p className="lf-desc">
            Track borrows, returns, and member activity efficiently.
          </p>
        </article>
      </section>

      <footer className="landing-footer">
        <p>@2026 Made by Team of three !! With guidence of padmanabham sir</p>
      </footer>
    </div>
  );
}

export default Landing;
