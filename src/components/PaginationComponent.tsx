import React from 'react';
import { Pagination } from 'react-bootstrap';

interface PaginationComponentProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (pageNumber: number) => Promise<void>;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageClick = async (pageNumber: number) => {
    try {
      await onPageChange(pageNumber);
    } catch (error) {
      console.error("Error changing page:", error);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <Pagination className="mt-3 d-flex justify-content-center align-items-center flex-wrap">
      <Pagination.First
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1}
        className="mx-1 btn btn-outline-primary btn-sm"
      />
      <Pagination.Prev
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 btn btn-outline-primary btn-sm"
      />
      {getPageNumbers().map((pageNumber) => (
        <Pagination.Item
          key={pageNumber}
          active={pageNumber === currentPage}
          onClick={() => handlePageClick(pageNumber)}
          className={`mx-1 btn ${
            pageNumber === currentPage
              ? "btn-primary"
              : "btn-outline-primary"
          } btn-sm`}
        >
          {pageNumber}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 btn btn-outline-primary btn-sm"
      />
      <Pagination.Last
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages}
        className="mx-1 btn btn-outline-primary btn-sm"
      />
    </Pagination>
  );
};

export default PaginationComponent;
