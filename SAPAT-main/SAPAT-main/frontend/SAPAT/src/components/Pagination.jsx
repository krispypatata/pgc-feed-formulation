function Pagination({ paginationInfo, onPageChange }) {
  const { page, totalPages } = paginationInfo

  const goToPrev = () => {
    if (page > 1) {
      onPageChange(page - 1)
    }
  }

  const goToNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1)
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []

    // For smaller number of pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }

    // For larger number of pages, show with ellipsis
    // Always include first and last page
    // Show current page and neighbors

    // First page
    pageNumbers.push(1)

    // If current page is close to start, don't show ellipsis at beginning
    if (page <= 4) {
      for (let i = 2; i <= 5; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('ellipsis')
    }
    // If current page is close to end, don't show ellipsis at end
    else if (page >= totalPages - 3) {
      pageNumbers.push('ellipsis')
      for (let i = totalPages - 4; i <= totalPages - 1; i++) {
        pageNumbers.push(i)
      }
    }
    // If current page is in middle, show ellipsis on both sides
    else {
      pageNumbers.push('ellipsis')
      for (let i = page - 1; i <= page + 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('ellipsis')
    }

    // Last page
    pageNumbers.push(totalPages)

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="fixed right-0 bottom-0 left-16 flex justify-center py-4 md:left-48">
      <div className="join">
        {/* prev button */}
        <button
          disabled={paginationInfo.page === 1}
          className="join-item btn btn-sm"
          onClick={goToPrev}
        >
          « Prev
        </button>

        {/* page buttons */}
        {pageNumbers.map((pageNum, index) => {
          // for ellipsis
          if (pageNum === 'ellipsis') {
            return <button key={`ellipsis-${index}`}>...</button>
          }
          // for page numbers
          return (
            <button
              key={`page-${index}`}
              className={`join-item btn btn-sm ${page === pageNum ? 'btn-active bg-green-button text-white' : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          )
        })}

        {/* next button */}
        <button
          disabled={
            paginationInfo.page === paginationInfo.totalPages ||
            paginationInfo.page > paginationInfo.totalPages
          }
          className="join-item btn btn-sm"
          onClick={goToNext}
        >
          Next »
        </button>
      </div>
    </div>
  )
}

export default Pagination
