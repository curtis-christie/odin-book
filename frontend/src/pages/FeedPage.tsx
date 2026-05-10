export function FeedPage() {
  return (
    <div className="content-stack">
      <section className="card-base p-6">
        <h1 className="text-ui-title">Feed</h1>
        <p className="text-ui-muted">
          Feed posts from you and followed users will appear here.
        </p>
      </section>

      <section className="composer-card">
        <div className="composer-top">
          <span className="avatar avatar-md" aria-hidden="true" />
          <button className="composer-prompt" type="button">
            What would you like to share?
          </button>
        </div>
      </section>

      <article className="post-card">
        <header className="post-header">
          <div className="inline-cluster">
            <span className="avatar avatar-md" aria-hidden="true" />
            <div>
              <p className="post-author-name">Alice Example</p>
              <p className="post-meta">@alice · placeholder</p>
            </div>
          </div>
        </header>

        <p className="post-body">
          Placeholder feed content. Backend posts will be added in a later
          step.
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
  );
}
