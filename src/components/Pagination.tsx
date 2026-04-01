"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const blockSize = 5;
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-wrap">
      <button
        className="page-nav"
        onClick={() => onPageChange(Math.max(1, startPage - blockSize))}
        disabled={startPage === 1}
      >
        ◁
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}
      <button
        className="page-nav"
        onClick={() =>
          onPageChange(Math.min(totalPages, startPage + blockSize))
        }
        disabled={endPage >= totalPages}
      >
        ▷
      </button>
    </div>
  );
}
