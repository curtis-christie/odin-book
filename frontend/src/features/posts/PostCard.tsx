import type { PublicPost } from "../../types/api";

type PostCardProps = {
  post: PublicPost;
};

export function PostCard({ post }: PostCardProps) {
  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const createdAt = new Date(post.createdAt).toLocaleDateString();

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="inline-cluster">
          {post.author.profileImageUrl ? (
            <img
              className="avatar avatar-md"
              src={post.author.profileImageUrl}
              alt=""
            />
          ) : (
            <span className="avatar avatar-md" aria-hidden="true" />
          )}

          <div>
            <p className="post-author-name">{authorName}</p>
            <p className="post-meta">
              @{post.author.username} · {createdAt}
            </p>
          </div>
        </div>
      </header>

      <p className="post-body">{post.content}</p>

      <footer className="post-footer">
        <div className="post-actions">
          <button className="post-action" type="button">
            {post.likeCount} Likes
          </button>

          <button className="post-action" type="button">
            {post.commentCount} Comments
          </button>
        </div>
      </footer>
    </article>
  );
}
