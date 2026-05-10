import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <div className="app-shell center-grid px-4">
      <section className="card-base w-full max-w-md p-6">
        <div className="content-stack">
          <div>
            <h1 className="text-ui-title">Log in to OdinBook</h1>
            <p className="text-ui-muted">
              The login form will be connected in the next step.
            </p>
          </div>

          <Link className="btn btn-primary" to="/feed">
            Temporary feed link
          </Link>

          <p className="text-ui-muted">
            Need an account?{" "}
            <Link className="rail-link" to="/register">
              Register
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
