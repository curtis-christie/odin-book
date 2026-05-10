function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <a className="brand-lockup" href="/">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">OdinBook</span>
          </a>

          <nav className="top-nav" aria-label="Primary navigation">
            <a className="top-nav-item top-nav-item-active" href="/">
              Feed
            </a>
            <a className="top-nav-item" href="/">
              Users
            </a>
            <a className="top-nav-item" href="/">
              Requests
            </a>
          </nav>
        </div>
      </header>

      <main className="app-container py-6">
        <div className="app-grid-responsive">
          <aside className="hide-below-lg">
            <section className="card-soft p-4">
              <nav className="sidebar-nav" aria-label="Sidebar navigation">
                <a className="sidebar-item sidebar-item-active" href="/">
                  <span className="sidebar-label">Home Feed</span>
                </a>
                <a className="sidebar-item" href="/">
                  <span className="sidebar-label">Find Users</span>
                </a>
                <a className="sidebar-item" href="/">
                  <span className="sidebar-label">Profile</span>
                </a>
              </nav>
            </section>
          </aside>

          <section className="app-main">
            <article className="card-base p-6">
              <div className="content-stack">
                <div>
                  <h1 className="text-ui-title">OdinBook frontend</h1>
                  <p className="text-ui-muted">
                    Static app shell is ready. Routing, authentication, and
                    API calls come next.
                  </p>
                </div>

                <div className="composer-card">
                  <div className="composer-top">
                    <span
                      className="avatar avatar-md"
                      aria-hidden="true"
                    />
                    <button className="composer-prompt" type="button">
                      What would you like to share?
                    </button>
                  </div>
                </div>

                <article className="post-card">
                  <header className="post-header">
                    <div className="inline-cluster">
                      <span
                        className="avatar avatar-md"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="post-author-name">Alice Example</p>
                        <p className="post-meta">@alice · just now</p>
                      </div>
                    </div>
                  </header>

                  <p className="post-body">
                    This is placeholder feed content. Real posts will come
                    from the backend later.
                  </p>

                  <footer className="post-footer">
                    <div className="post-actions">
                      <button className="post-action" type="button">
                        Like
                      </button>
                      <button className="post-action" type="button">
                        Comment
                      </button>
                    </div>
                  </footer>
                </article>
              </div>
            </article>
          </section>

          <aside className="hide-below-xl">
            <section className="rail-card">
              <div className="rail-card-header">
                <h2 className="rail-card-title">Next milestone</h2>
              </div>

              <p className="text-ui-muted">
                After this shell compiles, we will add the frontend folder
                structure and shared API/domain types.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
