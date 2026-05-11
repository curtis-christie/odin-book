import { Link } from "react-router-dom";
import type { PublicUserWithRelationship } from "../../types/api";

type UserListItemProps = {
  user: PublicUserWithRelationship;
  isActionLoading: boolean;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
};

export function UserListItem({
  user,
  isActionLoading,
  onFollow,
  onUnfollow,
}: UserListItemProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <article className="card-base mobile-card-padding split-row">
      <div className="follow-user">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={`${fullName}'s profile`}
            className="avatar avatar-md"
          />
        ) : (
          <div className="avatar avatar-md center-grid font-bold text-brand-600">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        )}

        <div className="min-w-0">
          <Link
            to={`/profile/${user.id}`}
            className="follow-name hover:text-brand-600"
          >
            {fullName}
          </Link>

          <p className="follow-handle">@{user.username}</p>

          {user.bio ? (
            <p className="text-ui-caption text-ellipsis-1">{user.bio}</p>
          ) : null}
        </div>
      </div>

      <div>
        {user.relationshipStatus === "SELF" ? (
          <span className="badge badge-muted">You</span>
        ) : null}

        {user.relationshipStatus === "PENDING" ? (
          <span className="badge badge-warning">Pending</span>
        ) : null}

        {user.relationshipStatus === "FOLLOWING" ? (
          <button
            type="button"
            className="btn btn-sm btn-secondary hover:btn-secondary-hover disabled:btn-disabled"
            disabled={isActionLoading}
            onClick={() => onUnfollow(user.id)}
          >
            {isActionLoading ? "Updating..." : "Unfollow"}
          </button>
        ) : null}

        {user.relationshipStatus === "NONE" ? (
          <button
            type="button"
            className="btn btn-sm btn-primary hover:btn-primary-hover disabled:btn-disabled"
            disabled={isActionLoading}
            onClick={() => onFollow(user.id)}
          >
            {isActionLoading ? "Sending..." : "Follow"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
