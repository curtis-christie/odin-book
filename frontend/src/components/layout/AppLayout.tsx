import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/useAuth";

type NavigationLink = {
  label: string;
  to: string;
};

const mainNavLinks: NavigationLink[] = [
  {
    label: "Feed",
    to: "/feed",
  },
  {
    label: "Users",
    to: "/users",
  },
  {
    label: "Requests",
    to: "/requests",
  },
];

const sidebarLinks: NavigationLink[] = [
  {
    label: "Home Feed",
    to: "/feed",
  },
  {
    label: "Find Users",
    to: "/users",
  },
  {
    label: "Profile",
    to: "/profile/me",
  },
  {
    label: "Settings",
    to: "/settings",
  },
];

export function AppLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink className="brand-lockup" to="/feed">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">OdinBook</span>
          </NavLink>

          <nav className="top-nav" aria-label="Primary navigation">
            {mainNavLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "top-nav-item top-nav-item-active"
                    : "top-nav-item"
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-container py-6">
        <div className="app-grid-responsive">
          <aside className="hide-below-lg">
            <section className="card-soft p-4">
              <nav className="sidebar-nav" aria-label="Sidebar navigation">
                {sidebarLinks.map((link) => (
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "sidebar-item sidebar-item-active"
                        : "sidebar-item"
                    }
                    key={link.to}
                    to={link.to}
                  >
                    <span className="sidebar-label">{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            </section>
          </aside>

          <section className="app-main">
            <Outlet />
          </section>

          <aside className="hide-below-xl">
            <section className="rail-card">
              <div className="rail-card-header">
                <h2 className="rail-card-title">Signed in</h2>
              </div>

              <p className="text-ui-muted">
                {user
                  ? `Logged in as @${user.username}`
                  : "Your session is loading."}
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
