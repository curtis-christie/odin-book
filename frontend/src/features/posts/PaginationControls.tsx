import type { PaginationMeta } from "../../types/api";

type PaginationControlsProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="split-row card-soft p-4">
      <button
        className="btn btn-secondary"
        type="button"
        disabled={!pagination.hasPreviousPage}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </button>

      <p className="text-ui-muted">
        Page {pagination.page} of {pagination.totalPages}
      </p>

      <button
        className="btn btn-secondary"
        type="button"
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
}
