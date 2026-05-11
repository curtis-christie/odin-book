import { SettingsProfileForm } from "../features/settings/SettingsProfileForm";
import { useAuth } from "../features/auth/useAuth";

export function SettingsPage() {
  const { user, loadCurrentUser } = useAuth();

  if (!user) {
    return (
      <section className="card-base mobile-card-padding">
        <p className="text-ui-muted">Your session is loading.</p>
      </section>
    );
  }

  return (
    <section className="section-stack">
      <SettingsProfileForm
        key={user.id}
        user={user}
        onProfileUpdated={loadCurrentUser}
      />
    </section>
  );
}
