import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <div className="app-shell center-grid px-4">
      <section className="card-base w-full max-w-md p-6">
        <div className="content-stack">
          <div>
            <h1 className="text-ui-title">Create your account</h1>
            <p className="text-ui-muted">
              The registration form will be connected after routing is
              stable.
            </p>
          </div>

          <p className="text-ui-muted">
            Already have an account?{" "}
            <Link className="rail-link" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
