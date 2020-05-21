import React from 'react';

export default function PageControlButtons({
  isTop = false,
  page,
  totalPage,
  nextPage,
  prevPage,
  value,
  resultsNum,
}) {
  return (
    <div className="w-100 d-flex align-content-center justify-content-between search-result-bar">
      <div className="search-result-term">
        {isTop
          ? `${resultsNum === 100 ? 'Top 100' : resultsNum} result${
              resultsNum > 1 ? 's' : ''
            } for '${value}'`
          : ' '}
      </div>
      {totalPage > 1 && (
        <div className="position-relative d-flex align-content-center justify-content-center">
          <div className="p-1 mx-1">
            Page {page}/{totalPage}
          </div>
          <div>
            <button
              className="plain-btn watch-search-btn page-btn"
              disabled={page === 1}
              onClick={prevPage}
            >
              <span tabIndex="-1">
                <i className="material-icons">chevron_left</i>
              </span>
            </button>
            <button
              className="plain-btn watch-search-btn page-btn"
              disabled={page === totalPage}
              onClick={nextPage}
            >
              <span tabIndex="-1">
                <i className="material-icons">chevron_right</i>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
