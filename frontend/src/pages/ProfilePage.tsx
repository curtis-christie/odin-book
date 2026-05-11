import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostCard } from "../features/posts/PostCard";
import { PaginationControls } from "../features/posts/PaginationControls";
import { ProfileHeader } from "../features/profiles/ProfileHeader";
import {
  getUserPosts,
  getUserProfile,
} from "../features/profiles/profileApi";
import {
  sendFollowRequest,
  unfollowUser,
} from "../features/users/userApi";
import { useAuth } from "../features/auth/useAuth";
import type {
  PaginationMeta,
  PublicPost,
  PublicUserWithRelationship,
} from "../types/api";
import { getErrorMessage } from "../utils/getErrorMessage";

const POSTS_PER_PAGE = 10;

export function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();

  const profileId = userId ?? currentUser?.id ?? null;

  const [profile, setProfile] =
    useState<PublicUserWithRelationship | null>(null);
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paginationState, setPaginationState] =
    useState<ProfilePagePaginationState>({
      profileId: "",
      page: 1,
    });

  const page =
    profileId && paginationState.profileId === profileId
      ? paginationState.page
      : 1;
  type ProfilePagePaginationState = {
    profileId: string;
    page: number;
  };

  useEffect(() => {
    let isActive = true;

    async function loadProfilePage() {
      if (!profileId) {
        setIsLoading(false);
        setErrorMessage("Profile could not be loaded.");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [profileResponse, postsResponse] = await Promise.all([
          getUserProfile(profileId),
          getUserPosts(profileId, page, POSTS_PER_PAGE),
        ]);

        if (!isActive) {
          return;
        }

        setProfile(profileResponse.user);
        setPosts(postsResponse.posts);
        setPagination(postsResponse.pagination);
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

    void loadProfilePage();

    return () => {
      isActive = false;
    };
  }, [profileId, page]);

  async function handleFollow(targetUserId: string) {
    try {
      setActionUserId(targetUserId);
      setErrorMessage(null);

      await sendFollowRequest(targetUserId);

      setProfile((currentProfile) => {
        if (!currentProfile || currentProfile.id !== targetUserId) {
          return currentProfile;
        }

        return {
          ...currentProfile,
          relationshipStatus: "PENDING",
        };
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionUserId(null);
    }
  }

  async function handleUnfollow(targetUserId: string) {
    try {
      setActionUserId(targetUserId);
      setErrorMessage(null);

      await unfollowUser(targetUserId);

      setProfile((currentProfile) => {
        if (!currentProfile || currentProfile.id !== targetUserId) {
          return currentProfile;
        }

        return {
          ...currentProfile,
          relationshipStatus: "NONE",
        };
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionUserId(null);
    }
  }

  function handlePageChange(nextPage: number) {
    if (!profileId) {
      return;
    }

    setPaginationState({
      profileId,
      page: nextPage,
    });
  }

  if (isLoading) {
    return (
      <section className="section-stack">
        <div className="card-base mobile-card-padding text-ui-muted">
          Loading profile...
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="section-stack">
        <div className="card-base mobile-card-padding border-danger-500 bg-danger-50 text-danger-600">
          {errorMessage}
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="section-stack">
        <div className="card-base mobile-card-padding text-ui-muted">
          Profile not found.
        </div>
      </section>
    );
  }

  return (
    <section className="section-stack">
      <ProfileHeader
        profile={profile}
        isActionLoading={actionUserId === profile.id}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />

      <section className="section-stack">
        <header className="card-base mobile-card-padding">
          <h2 className="text-ui-title">Posts</h2>
          <p className="text-ui-muted">
            Recent posts from {profile.firstName}.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="card-base mobile-card-padding text-ui-muted">
            No posts yet.
          </div>
        ) : null}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {pagination ? (
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        ) : null}
      </section>
    </section>
  );
}
