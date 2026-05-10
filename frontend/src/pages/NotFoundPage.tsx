import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="app-shell center-grid px-4">
      <section className="card-base w-full max-w-md p-6">
        <div className="content-stack">
          <div>
            <h1 className="text-ui-title">Page not found</h1>
            <p className="text-ui-muted">
              The page you requested does not exist.
            </p>
          </div>

          <Link className="btn btn-primary" to="/feed">
            Go to feed
          </Link>
        </div>
      </section>
    </div>
  );
}
