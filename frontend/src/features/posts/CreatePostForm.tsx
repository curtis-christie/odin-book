import { useState, type ChangeEvent, type SubmitEvent } from "react";

type CreatePostFormProps = {
  isSubmitting: boolean;
  onCreatePost: (content: string) => Promise<void>;
};

export function CreatePostForm({
  isSubmitting,
  onCreatePost,
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleContentChange(
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void {
    setContent(event.target.value);
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setErrorMessage("Post content is required.");
      return;
    }

    if (trimmedContent.length > 1000) {
      setErrorMessage("Post content must be 1000 characters or less.");
      return;
    }

    setErrorMessage(null);

    await onCreatePost(trimmedContent);
    setContent("");
  }

  return (
    <section className="composer-card">
      <form onSubmit={handleSubmit}>
        <div className="composer-top">
          <span className="avatar avatar-md" aria-hidden="true" />

          <textarea
            className="form-input min-h-24 resize-none py-3"
            name="content"
            placeholder="What would you like to share?"
            value={content}
            onChange={handleContentChange}
          />
        </div>

        {errorMessage ? (
          <div className="px-4 pb-3">
            <p className="text-ui-muted" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          </div>
        ) : null}

        <div className="split-row divider-top px-4 py-3">
          <p className="text-ui-caption">{content.trim().length}/1000</p>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Create post"}
          </button>
        </div>
      </form>
    </section>
  );
}
