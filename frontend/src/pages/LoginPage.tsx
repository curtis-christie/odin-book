import { useState, type ChangeEvent, type SubmitEvent } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { getRedirectPath } from "../features/auth/getRedirectPath";
import { useAuth } from "../features/auth/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

type LoginFormState = {
  identifier: string;
  password: string;
};

const initialLoginFormState: LoginFormState = {
  identifier: "",
  password: "",
};

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();

  const [formData, setFormData] = useState<LoginFormState>(
    initialLoginFormState,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const fieldName = event.target.name as keyof LoginFormState;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: event.target.value,
    }));
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const identifier = formData.identifier.trim();
    const password = formData.password;

    if (!identifier || !password) {
      setErrorMessage("Email/username and password are required.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({
        identifier,
        password,
      });

      navigate(getRedirectPath(location), {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to log in. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell center-grid px-4">
      <section className="card-base w-full max-w-md p-6">
        <form className="content-stack" onSubmit={handleSubmit}>
          <div>
            <h1 className="text-ui-title">Log in to OdinBook</h1>
            <p className="text-ui-muted">
              Enter your email or username to continue.
            </p>
          </div>

          {errorMessage ? (
            <p className="text-ui-muted" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}

          <div className="content-stack">
            <label className="content-stack" htmlFor="identifier">
              <span className="text-ui-subtitle">Email or username</span>
              <input
                className="form-input"
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={formData.identifier}
                onChange={handleInputChange}
              />
            </label>

            <label className="content-stack" htmlFor="password">
              <span className="text-ui-subtitle">Password</span>
              <input
                className="form-input"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          <p className="text-ui-muted">
            Need an account?{" "}
            <Link className="rail-link" to="/register">
              Register
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
