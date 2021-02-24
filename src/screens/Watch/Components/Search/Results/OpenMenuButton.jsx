import React from 'react';
const menuControl = {};
export default function OpenMenuButton({ show, menu, name }) {
  return show ? (
    <div className="w-100 d-flex px-3">
      <button
        className="plain-btn watch-search-btn page-btn"
        aria-label={`See all ${name}`}
        aria-haspopup="true"
        onClick={() => menuControl.open(menu)}
      >
        <span className="py-2 px-4 my-1 fsize-1-3" tabIndex="-1">
          See all {name}
        </span>
      </button>
    </div>
  ) : null;
}
