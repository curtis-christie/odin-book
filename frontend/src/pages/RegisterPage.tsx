import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

type RegisterFormState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialRegisterFormState: RegisterFormState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormState>(
    initialRegisterFormState,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const fieldName = event.target.name as keyof RegisterFormState;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: event.target.value,
    }));
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!firstName || !lastName || !username || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await register({
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      });

      navigate("/feed", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to register. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell center-grid px-4 py-6">
      <section className="card-base w-full max-w-md p-6">
        <form className="content-stack" onSubmit={handleSubmit}>
          <div>
            <h1 className="text-ui-title">Create your account</h1>
            <p className="text-ui-muted">
              Join OdinBook to create posts, follow users, and view your
              feed.
            </p>
          </div>

          {errorMessage ? (
            <p className="text-ui-muted" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}

          <div className="content-stack">
            <label className="content-stack" htmlFor="firstName">
              <span className="text-ui-subtitle">First name</span>
              <input
                className="form-input"
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </label>

            <label className="content-stack" htmlFor="lastName">
              <span className="text-ui-subtitle">Last name</span>
              <input
                className="form-input"
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </label>

            <label className="content-stack" htmlFor="username">
              <span className="text-ui-subtitle">Username</span>
              <input
                className="form-input"
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </label>

            <label className="content-stack" htmlFor="email">
              <span className="text-ui-subtitle">Email</span>
              <input
                className="form-input"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </label>

            <label className="content-stack" htmlFor="confirmPassword">
              <span className="text-ui-subtitle">Confirm password</span>
              <input
                className="form-input"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-ui-muted">
            Already have an account?{" "}
            <Link className="rail-link" to="/login">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
