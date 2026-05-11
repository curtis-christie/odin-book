import type { PublicUserWithRelationship } from "../../types/api";

type ProfileHeaderProps = {
  profile: PublicUserWithRelationship;
  isActionLoading: boolean;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
};

export function ProfileHeader({
  profile,
  isActionLoading,
  onFollow,
  onUnfollow,
}: ProfileHeaderProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <article className="card-base overflow-hidden">
      <div className="h-32 bg-brand-50" />

      <div className="mobile-card-padding">
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="inline-cluster-lg">
            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={`${fullName}'s profile`}
                className="avatar avatar-xl border-4 border-white"
              />
            ) : (
              <div className="avatar avatar-xl center-grid border-4 border-white text-lg font-extrabold text-brand-600">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {fullName}
              </h1>

              <p className="text-ui-muted">@{profile.username}</p>
            </div>
          </div>

          <div>
            {profile.relationshipStatus === "SELF" ? (
              <span className="badge badge-muted">You</span>
            ) : null}

            {profile.relationshipStatus === "PENDING" ? (
              <span className="badge badge-warning">Pending</span>
            ) : null}

            {profile.relationshipStatus === "FOLLOWING" ? (
              <button
                type="button"
                className="btn btn-sm btn-secondary hover:btn-secondary-hover disabled:btn-disabled"
                disabled={isActionLoading}
                onClick={() => onUnfollow(profile.id)}
              >
                {isActionLoading ? "Updating..." : "Unfollow"}
              </button>
            ) : null}

            {profile.relationshipStatus === "NONE" ? (
              <button
                type="button"
                className="btn btn-sm btn-primary hover:btn-primary-hover disabled:btn-disabled"
                disabled={isActionLoading}
                onClick={() => onFollow(profile.id)}
              >
                {isActionLoading ? "Sending..." : "Follow"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          {profile.bio ? (
            <p className="text-ui-body">{profile.bio}</p>
          ) : (
            <p className="text-ui-muted">No bio yet.</p>
          )}
        </div>
      </div>
    </article>
  );
}
