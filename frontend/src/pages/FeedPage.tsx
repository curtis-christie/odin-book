import { useEffect, useState } from "react";

import { CreatePostForm } from "../features/posts/CreatePostForm";
import { PaginationControls } from "../features/posts/PaginationControls";
import { PostCard } from "../features/posts/PostCard";
import {
  createPost,
  getFeedPosts,
  type FeedPostsResponse,
} from "../features/posts/postApi";
import type { PublicPost } from "../types/api";
import { getErrorMessage } from "../utils/getErrorMessage";

const FEED_PAGE_LIMIT = 10;

export function FeedPage() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [pagination, setPagination] = useState<
    FeedPostsResponse["pagination"] | null
  >(null);
  const [page, setPage] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadFeedPostsForPage(): Promise<void> {
      try {
        const response = await getFeedPosts({
          page,
          limit: FEED_PAGE_LIMIT,
        });

        if (!isActive) {
          return;
        }

        setPosts(response.posts);
        setPagination(response.pagination);
        setErrorMessage(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(
          getErrorMessage(error, "Unable to load feed posts."),
        );
        setPosts([]);
        setPagination(null);
      } finally {
        if (isActive) {
          setIsLoadingPosts(false);
        }
      }
    }

    void loadFeedPostsForPage();

    return () => {
      isActive = false;
    };
  }, [page]);

  async function handleCreatePost(content: string): Promise<void> {
    setIsCreatingPost(true);
    setErrorMessage(null);

    try {
      const response = await createPost({
        content,
      });

      if (page === 1) {
        setPosts((currentPosts) => [response.post, ...currentPosts]);
      } else {
        setIsLoadingPosts(true);
        setPage(1);
      }

      setPagination((currentPagination) => {
        if (!currentPagination) {
          return currentPagination;
        }

        return {
          ...currentPagination,
          totalCount: currentPagination.totalCount + 1,
        };
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create post."));
    } finally {
      setIsCreatingPost(false);
    }
  }

  function handlePageChange(nextPage: number): void {
    setIsLoadingPosts(true);
    setPage(nextPage);
  }

  return (
    <div className="content-stack">
      <section className="card-base p-6">
        <h1 className="text-ui-title">Feed</h1>
        <p className="text-ui-muted">
          Recent posts from you and users you follow.
        </p>
      </section>

      <CreatePostForm
        isSubmitting={isCreatingPost}
        onCreatePost={handleCreatePost}
      />

      {errorMessage ? (
        <section className="card-soft p-4">
          <p className="text-ui-muted" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        </section>
      ) : null}

      {isLoadingPosts ? (
        <section className="card-soft p-4">
          <p className="text-ui-muted">Loading feed posts...</p>
        </section>
      ) : null}

      {!isLoadingPosts && posts.length === 0 ? (
        <section className="card-soft p-4">
          <h2 className="text-ui-title">No posts yet</h2>
          <p className="text-ui-muted">
            Create your first post or follow other users to build your
            feed.
          </p>
        </section>
      ) : null}

      {!isLoadingPosts
        ? posts.map((post) => <PostCard key={post.id} post={post} />)
        : null}

      {pagination && pagination.totalPages > 1 ? (
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      ) : null}
    </div>
  );
}
