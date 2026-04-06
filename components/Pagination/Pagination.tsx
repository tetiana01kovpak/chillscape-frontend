'use client';

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';


interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
    pageCount={totalPages}
    pageRangeDisplayed={3}
    marginPagesDisplayed={1}
    onPageChange={({ selected }) => setCurrentPage(selected + 1)}
    forcePage={currentPage - 1}
    breakLabel="..."
    previousLabel="←"
    nextLabel="→"
    containerClassName={css.pagination}
    pageClassName={css.pageItem}
    pageLinkClassName={css.pageLink}
    previousClassName={css.arrowItem}
    previousLinkClassName={css.arrowLink}
    nextClassName={css.arrowItem}
    nextLinkClassName={css.arrowLink}
    breakClassName={css.breakItem}
    breakLinkClassName={css.breakLink}
    activeClassName={css.active}
    disabledClassName={css.disabled}
    renderOnZeroPageCount={null}
    />
    );
}