import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, currentPage + halfVisiblePages);

    // Adjust startPage and endPage if near the beginning or end of total pages
    if (currentPage <= halfVisiblePages) {
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage + halfVisiblePages > totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div className="flex justify-center mt-4">
      <ul className="flex space-x-2">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
          >
            Previous
          </button>
        </li>

        {visiblePageNumbers[0] > 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 rounded border bg-gray-200 text-black hover:bg-gray-300"
              >
                1
              </button>
            </li>
            {visiblePageNumbers[0] > 2 && (
              <li>
                <span className="px-3 py-1">...</span>
              </li>
            )}
          </>
        )}

        {visiblePageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded border ${currentPage === number ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
            >
              {number}
            </button>
          </li>
        ))}

        {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
          <>
            {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && (
              <li>
                <span className="px-3 py-1">...</span>
              </li>
            )}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 rounded border bg-gray-200 text-black hover:bg-gray-300"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
