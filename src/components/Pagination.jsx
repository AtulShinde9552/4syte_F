export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Hide karne ki condition (if totalPages <= 1 return null) hata di gayi hai.
  // Ab agar data 0 bhi hoga, toh kam se kam Page 1 show hoga layout maintain rakhne ke liye.
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex items-center justify-end gap-4 px-6 py-5 text-sm shrink-0 border-t border-[#EBEBEB]">
      <span className="text-gray-500 uppercase tracking-wide">
        Page
      </span>

      {Array.from({ length: safeTotalPages }, (_, index) => {
        const page = index + 1;
        const active = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              transition-colors
              ${
                active
                  ? "text-[#00A292] font-semibold"
                  : "text-gray-600 hover:text-[#00A292]"
              }
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() =>
          currentPage < safeTotalPages &&
          onPageChange(currentPage + 1)
        }
        disabled={currentPage === safeTotalPages}
        className={`
          uppercase
          transition-colors
          ${
            currentPage === safeTotalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-[#00A292]"
          }
        `}
      >
        Next
      </button>
    </div>
  );
}