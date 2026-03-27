const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handlePage = page => {
        onPageChange(page);
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Don't show pagination if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-4 py-8">
            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`
                    px-4 py-1 transition-all duration-200 h-7
                    flex items-center gap-2 border-2 border-transparent text-xs rounded-md
                    ${
                        currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:border-gray-300 cursor-pointer'
                    }
                `}
                aria-label="Previous page"
            >
                <svg
                    data-prefix="fas"
                    data-icon="angles-left"
                    className="w-3 h-3"
                    role="img"
                    viewBox="0 0 448 512"
                    aria-hidden="true"
                >
                    <path
                        fill="currentColor"
                        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256 406.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"
                    ></path>
                </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    const isActive = pageNum === currentPage;
                    return (
                        <button
                            key={index}
                            className={`
                                py-1 px-4 border-2 rounded-md cursor-pointer text-xs font-medium
                                transition-all duration-200
                                ${
                                    isActive
                                        ? 'bg-[#f05123] text-white border-[#f05123]'
                                        : 'bg-white text-gray-700 border-transparent hover:border-gray-300'
                                }
                            `}
                            onClick={() => handlePage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`
                    px-4 py-1 transition-all duration-200 h-7
                    flex items-center gap-2 border-2 border-transparent text-xs rounded-md
                    ${
                        currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:border-gray-300 cursor-pointer'
                    }
                `}
                aria-label="Next page"
            >
                <svg
                    data-prefix="fas"
                    data-icon="angles-right"
                    className="w-3 h-3"
                    role="img"
                    viewBox="0 0 448 512"
                    aria-hidden="true"
                >
                    <path
                        fill="currentColor"
                        d="M439.1 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L371.2 256 233.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L179.2 256 41.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
                    ></path>
                </svg>
            </button>
        </div>
    );
};

export default Pagination;
