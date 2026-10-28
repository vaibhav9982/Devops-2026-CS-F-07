import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './HomePage.css';

const steps = [
  { number: '01', title: 'Add your code', description: 'Paste a snippet in the language you already use.' },
  { number: '02', title: 'Let AI map it out', description: 'Get a clear, interactive view of how it works.' },
  { number: '03', title: 'Learn by exploring', description: 'Move through each step at your own pace.' },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const actionHref = user ? '/dashboard' : '/register';
  const actionLabel = user ? 'Go to your workspace' : 'Get started for free';

  return (
    <div className="home-page">
      <header className="home-header">
        <Link className="home-brand" to="/" aria-label="Code Visualizer home">
          <span className="home-brand-mark" aria-hidden="true">&lt;/&gt;</span>
          <span>Code Visualizer</span>
        </Link>
        <nav className="home-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          {!loading && (
            user ? (
              <Link className="home-nav-cta" to="/dashboard">Workspace <span aria-hidden="true">↗</span></Link>
            ) : (
              <>
                <Link className="home-sign-in" to="/login">Sign in</Link>
                <Link className="home-nav-cta" to="/register">Get started <span aria-hidden="true">↗</span></Link>
              </>
            )
          )}
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-eyebrow"><span /> A clearer way to understand code</p>
            <h1>Make code make <span>sense.</span></h1>
            <p className="home-lede">
              Turn hard-to-follow source code into visual, step-by-step explanations.
              Explore the logic, not just the lines.
            </p>
            <div className="home-actions">
              <Link className="home-primary-button" to={actionHref}>
                {actionLabel} <span aria-hidden="true">→</span>
              </Link>
              <a className="home-secondary-button" href="#how-it-works">See how it works</a>
            </div>
            <p className="home-note"><span aria-hidden="true">✦</span> Built for curious minds and clearer thinking</p>
          </div>

          <div className="home-visual" aria-label="Example of code becoming a visual explanation">
            <div className="home-orbit home-orbit-one" />
            <div className="home-orbit home-orbit-two" />
            <div className="home-code-card">
              <div className="home-code-topbar">
                <div className="home-window-dots" aria-hidden="true"><i /><i /><i /></div>
                <span>bubble-sort.js</span>
                <span className="home-language-tag">JS</span>
              </div>
              <div className="home-code-content">
                <div className="home-code-line"><span>1</span><code><b>function</b> <em>bubbleSort</em>(array) {'{'}</code></div>
                <div className="home-code-line"><span>2</span><code>&nbsp;&nbsp;<b>for</b> (let i = 0; i &lt; array.length; i++) {'{'}</code></div>
                <div className="home-code-line home-code-active"><span>3</span><code>&nbsp;&nbsp;&nbsp;&nbsp;<b>if</b> (array[i] &gt; array[i + 1]) {'{'}</code></div>
                <div className="home-code-line"><span>4</span><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swap(array, i);</code></div>
                <div className="home-code-line"><span>5</span><code>&nbsp;&nbsp;&nbsp;&nbsp;{'}'}</code></div>
                <div className="home-code-line"><span>6</span><code>&nbsp;&nbsp;{'}'}</code></div>
                <div className="home-code-line"><span>7</span><code>{'}'}</code></div>
              </div>
              <div className="home-visualizer">
                <div className="home-visualizer-heading"><span><i /> LIVE VISUALIZATION</span><span>Step 3 of 8</span></div>
                <div className="home-bars" aria-label="Array values 5, 2, 8, 3, 1">
                  {[5, 2, 8, 3, 1].map((value, index) => (
                    <div className={`home-bar-wrap ${index < 2 ? 'is-active' : ''}`} key={value}>
                      <span className="home-bar-value">{value}</span>
                      <div className="home-bar" style={{ height: `${value * 10 + 16}px` }} />
                      <span className="home-bar-index">{index}</span>
                    </div>
                  ))}
                </div>
                <div className="home-visualizer-footer"><span>Comparing <b>5</b> and <b>2</b></span><span className="home-play" aria-hidden="true">▶</span></div>
              </div>
              <div className="home-ai-badge"><span aria-hidden="true">✦</span> AI explained</div>
            </div>
          </div>
        </section>

        <section className="home-how" id="how-it-works">
          <div className="home-section-heading">
            <p className="home-eyebrow">FROM SOURCE TO “OH, I GET IT”</p>
            <h2>Understand the <span>whole picture.</span></h2>
            <p>Go from a block of code to a concept you can actually see.</p>
          </div>
          <div className="home-steps">
            {steps.map((step) => (
              <article className="home-step" key={step.number}>
                <span className="home-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <Link className="home-brand" to="/">
          <span className="home-brand-mark" aria-hidden="true">&lt;/&gt;</span>
          <span>Code Visualizer</span>
        </Link>
        <span>See the logic behind every line.</span>
      </footer>
    </div>
  );
}
