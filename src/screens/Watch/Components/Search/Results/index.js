import React, { useState, useEffect } from 'react';
import { util } from 'utils';
import {
  searchControl,
  // preferControl,
  SEARCH_INIT,
  SEARCH_RESULT,
  SEARCH_BEGIN,
  SEARCH_TRANS_IN_VIDEO,
} from '../../../Utils';
import './index.css';

import ResultList from './ResultList';
import Placeholder from '../Placeholder';

function Results({ search = SEARCH_INIT }) {
  const { value = '', status = SEARCH_BEGIN } = search;

  const [option, setOption] = useState(SEARCH_TRANS_IN_VIDEO);
  const [page, setPage] = useState(1); // 20 results per page
  const [resultOptions, setResultOptions] = useState([]);

  const handleChangeOption = (opt) => () => {
    setOption(opt);
    // preferControl.defaultSearchOption(opt)
    setPage(1);
  };

  const nextPage = () => {
    setPage(page + 1);
    util.elem.scrollToTop('watch-search-result-container');
  };

  const prevPage = () => {
    setPage(page - 1);
    util.elem.scrollToTop('watch-search-result-container');
  };

  useEffect(() => {
    setPage(1);
    setResultOptions(searchControl.getResultOptions(search, (opt) => handleChangeOption(opt)()));
  }, [search]);

  useEffect(() => {
    if (resultOptions.length > 0 && !resultOptions[0].init) {
      handleChangeOption(resultOptions[0].opt)();
    }
  }, [resultOptions]);

  return (
    <div id="watch-search-result-container" className="watch-search-result-container">
      {status !== SEARCH_RESULT ? null : (
        <>
          {/* Result Option Tabs */}
          <div className="search-result-options">
            Found
            {resultOptions.map((opt) => (
              <button
                className="plain-btn watch-search-btn search-options-btn"
                data-current={Boolean(opt.opt === option)}
                onClick={handleChangeOption(opt.opt)}
                aria-label={opt.content}
                key={`result-option-${opt.opt}`}
              >
                <span tabIndex="-1">{opt.init ? <Placeholder small /> : `${opt.content}`}</span>
              </button>
            ))}
            {resultOptions.length === 0 && ' 0 results '}
            {`for '${value}'`}
          </div>

          {/* List of results */}
          {resultOptions.length > 0 && (
            <ResultList
              search={search}
              option={option}
              page={page}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Results;
