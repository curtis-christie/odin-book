import { useState, type ChangeEvent, type SubmitEvent } from "react";

import type { SafeUser } from "../../types/api";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { updateCurrentUser } from "./settingsApi";

type SettingsProfileFormProps = {
  user: SafeUser;
  onProfileUpdated: () => Promise<void>;
};

type SettingsFormState = {
  firstName: string;
  lastName: string;
  bio: string;
  profileImageUrl: string;
};

function getInitialSettingsFormState(user: SafeUser): SettingsFormState {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio ?? "",
    profileImageUrl: user.profileImageUrl ?? "",
  };
}

export function SettingsProfileForm({
  user,
  onProfileUpdated,
}: SettingsProfileFormProps) {
  const [formData, setFormData] = useState<SettingsFormState>(() =>
    getInitialSettingsFormState(user),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const fieldName = event.target.name as keyof SettingsFormState;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: event.target.value,
    }));
  }

  function getValidatedProfileImageUrl(): string | null {
    const profileImageUrl = formData.profileImageUrl.trim();

    if (!profileImageUrl) {
      return null;
    }

    try {
      return new URL(profileImageUrl).toString();
    } catch {
      throw new Error("Profile image URL must be a valid URL.");
    }
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const bio = formData.bio.trim();

    if (!firstName || !lastName) {
      setErrorMessage("First name and last name are required.");
      setSuccessMessage(null);
      return;
    }

    if (bio.length > 160) {
      setErrorMessage("Bio must be 160 characters or less.");
      setSuccessMessage(null);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateCurrentUser({
        firstName,
        lastName,
        bio: bio || null,
        profileImageUrl: getValidatedProfileImageUrl(),
      });

      await onProfileUpdated();

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to update your profile."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="card-base mobile-card-padding content-stack"
      onSubmit={handleSubmit}
    >
      <div>
        <h1 className="text-ui-title">Profile settings</h1>
        <p className="text-ui-muted">
          Update the public profile information shown to other users.
        </p>
      </div>

      {errorMessage ? (
        <p className="text-ui-muted" role="alert" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="text-ui-muted" role="status" aria-live="polite">
          {successMessage}
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

        <label className="content-stack" htmlFor="bio">
          <span className="text-ui-subtitle">Bio</span>
          <textarea
            className="form-input min-h-28 py-3"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
          <span className="text-ui-caption">
            {formData.bio.trim().length}/160 characters
          </span>
        </label>

        <label className="content-stack" htmlFor="profileImageUrl">
          <span className="text-ui-subtitle">Profile image URL</span>
          <input
            className="form-input"
            id="profileImageUrl"
            name="profileImageUrl"
            type="url"
            autoComplete="url"
            value={formData.profileImageUrl}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
