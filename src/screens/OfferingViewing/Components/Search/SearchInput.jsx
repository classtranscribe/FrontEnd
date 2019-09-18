import React from 'react'

function SearchInput({ searchValue, onInput }) {
  return (
    <div className="sb-input">
      <div className="ui icon input">
        <input autoFocus
          type="text" className="prompt" id="search"
          aria-label="Search for courses"
          value={searchValue}
          onChange={onInput}
          placeholder="Search for Courses ..."
          autoComplete="off"
        />
        <i aria-hidden="true" className="search icon"></i>
      </div>
    </div>
  )
}

export default SearchInput