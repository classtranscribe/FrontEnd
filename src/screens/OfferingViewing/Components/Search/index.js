/**
 * SearchBar, a sub screen of Home page, shows up when user want to search a course
 */

import React, { useState, useEffect } from 'react';
import { ClassTranscribeFooter } from 'components';
import { search, util } from 'utils';
import './index.css';

import SearchInput from './SearchInput';
import SearchResult from './SearchResult';

export function Search({ offerings, location }) {
  const defaultValue = location.state ? location.state.value : '';
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [results, setResults] = useState([]);

  const searchInOfferings = (value) => {
    return search.getResults(offerings, value, [
      'termName',
      'fullNumber',
      'courseName',
      'sectionName',
    ]);
  };

  useEffect(() => {
    util.elem.scrollIntoView('sp-content');
    util.links.title('Search');
    window.scrollTo(0, 0);
    if (offerings.length) {
      if (defaultValue) {
        setResults(searchInOfferings(defaultValue));
      }
    }
  }, [offerings]);

  if (!offerings.length) return null;

  const onInput = ({ target: { value } }) => {
    setSearchValue(value);
    if (!value) {
      setResults([]);
      return;
    }
    setResults(searchInOfferings(value));
  };

  return (
    <div className="sp-search-bar ct-a-fade-in" id="sp-search-bar">
      <h1>Search for Courses</h1>

      <SearchInput searchValue={searchValue} onInput={onInput} />

      <SearchResult results={results} searchValue={searchValue} />

      <ClassTranscribeFooter />
    </div>
  );
}
