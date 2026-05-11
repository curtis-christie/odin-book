import { useEffect, useState } from "react";
import {
  getUsers,
  sendFollowRequest,
  unfollowUser,
} from "../features/users/userApi";
import { UserListItem } from "../features/users/UserListItem";
import { PaginationControls } from "../features/posts/PaginationControls";
import type {
  PaginationMeta,
  PublicUserWithRelationship,
  RelationshipStatus,
} from "../types/api";
import { getErrorMessage } from "../utils/getErrorMessage";

const USERS_PER_PAGE = 10;

function updateUserRelationshipStatus(
  users: PublicUserWithRelationship[],
  userId: string,
  relationshipStatus: RelationshipStatus,
): PublicUserWithRelationship[] {
  return users.map((user) => {
    if (user.id !== userId) {
      return user;
    }

    return {
      ...user,
      relationshipStatus,
    };
  });
}

export function UsersPage() {
  const [users, setUsers] = useState<PublicUserWithRelationship[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadUsersForPage() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getUsers(page, USERS_PER_PAGE);

        if (!isActive) {
          return;
        }

        setUsers(response.users);
        setPagination(response.pagination);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadUsersForPage();

    return () => {
      isActive = false;
    };
  }, [page]);

  async function handleFollow(userId: string) {
    try {
      setActionUserId(userId);
      setErrorMessage(null);

      await sendFollowRequest(userId);

      setUsers((currentUsers) =>
        updateUserRelationshipStatus(currentUsers, userId, "PENDING"),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionUserId(null);
    }
  }

  async function handleUnfollow(userId: string) {
    try {
      setActionUserId(userId);
      setErrorMessage(null);

      await unfollowUser(userId);

      setUsers((currentUsers) =>
        updateUserRelationshipStatus(currentUsers, userId, "NONE"),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionUserId(null);
    }
  }

  return (
    <section className="section-stack">
      <header className="card-base mobile-card-padding">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Find People
        </h1>
        <p className="text-ui-muted">
          Discover other OdinBook users and send follow requests.
        </p>
      </header>

      {errorMessage ? (
        <div className="card-base mobile-card-padding border-danger-500 bg-danger-50 text-danger-600">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="card-base mobile-card-padding text-ui-muted">
          Loading users...
        </div>
      ) : null}

      {!isLoading && users.length === 0 ? (
        <div className="card-base mobile-card-padding text-ui-muted">
          No users found.
        </div>
      ) : null}

      {!isLoading && users.length > 0 ? (
        <div className="section-stack">
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isActionLoading={actionUserId === user.id}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          ))}
        </div>
      ) : null}

      {pagination ? (
        <PaginationControls
          pagination={pagination}
          onPageChange={setPage}
        />
      ) : null}
    </section>
  );
}
