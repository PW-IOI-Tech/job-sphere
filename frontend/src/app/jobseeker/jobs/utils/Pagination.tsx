interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  loading = false,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px',
      margin: '30px 0',
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev || loading}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          backgroundColor: !hasPrev || loading ? '#f8f9fa' : 'white',
          cursor: !hasPrev || loading ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
        }}
      >
        Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={loading}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            backgroundColor: page === currentPage ? '#007bff' : 'white',
            color: page === currentPage ? 'white' : 'black',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || loading}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          backgroundColor: !hasNext || loading ? '#f8f9fa' : 'white',
          cursor: !hasNext || loading ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
        }}
      >
        Next
      </button>
    </div>
  );
};
