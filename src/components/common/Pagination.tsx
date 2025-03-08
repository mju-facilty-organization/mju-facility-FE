import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        0,
        currentPage - Math.floor(maxPagesToShow / 2)
      );
      const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        const newStartPage = Math.max(0, endPage - maxPagesToShow + 1);
        for (let i = newStartPage; i <= endPage; i++) {
          pages.push(i);
        }
      } else {
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-6">
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="페이지네이션"
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
            currentPage === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          } text-sm font-medium`}
        >
          <span className="sr-only">이전</span>
          <ChevronLeft className="h-5 w-5" />
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              currentPage === pageNum
                ? 'z-10 bg-myongji text-white border-myongji'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {pageNum + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
            currentPage >= totalPages - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          } text-sm font-medium`}
        >
          <span className="sr-only">다음</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
