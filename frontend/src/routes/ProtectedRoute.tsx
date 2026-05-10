import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../features/auth/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-shell center-grid">
        <section className="card-base p-6">
          <p className="text-ui-muted">Checking your session...</p>
        </section>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
