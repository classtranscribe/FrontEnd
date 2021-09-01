import React, { useState, useEffect } from 'react';
import { elem } from 'utils/use-elem';
import _ from 'lodash'
import {
  ARRAY_INIT,
  ARRAY_EMPTY,
  SEARCH_INIT,
  SEARCH_RESULT,
  SEARCH_BEGIN,
  SEARCH_TRANS_IN_VIDEO,
  SEARCH_IN_PLAYLISTS,
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_SHORTCUTS
} from '../../../Utils';
import './index.scss';

import ResultList from './ResultList';
import Placeholder from '../Placeholder';
// Function used to get the options for results
const search_options = [
  SEARCH_TRANS_IN_VIDEO,
  SEARCH_IN_PLAYLISTS,
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_SHORTCUTS,
];
// Function used to get the number of results
function resultNum(results) {
  if (results === ARRAY_INIT || results === ARRAY_EMPTY) {
    return 0;
  }

  return results.length;
}
function getResultOptions(search = SEARCH_INIT) {
  const {
    inVideoTransResults = [],
    inCourseTransResults = [],
    playlistResults = [],
    shortcutResults = [],
  } = search;

  const optNumMap = {
    [SEARCH_TRANS_IN_VIDEO]: [_.flatten(inVideoTransResults), 'caption', 'video'],
    [SEARCH_IN_PLAYLISTS]: [playlistResults, 'video title', 'course'],
    [SEARCH_TRANS_IN_COURSE]: [inCourseTransResults, 'caption', 'course'],
    [SEARCH_IN_SHORTCUTS]: [shortcutResults, 'shortcut', 'page'],
  };

  // let defaultOpt = preferControl.defaultSearchOption() || SEARCH_TRANS_IN_VIDEO;

  const options = search_options
    .map((opt) => {
      const [res, name, range] = optNumMap[opt];
      const num = resultNum(res);
      const init = res === ARRAY_INIT;
      return {
        opt,
        num,
        init,
        // current: opt === defaultOpt,
        content: `${num >= 100 ? '99+' : num} ${name}${num > 1 ? 's' : ''} in this ${range}`,
      };
    })
    .filter((opt) => opt.num !== 0 || opt.init);

  return options;
}
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
    elem.scrollToTop('watch-search-result-container');
  };

  const prevPage = () => {
    setPage(page - 1);
    elem.scrollToTop('watch-search-result-container');
  };

  useEffect(() => {
    setPage(1);
    setResultOptions(getResultOptions(search, (opt) => handleChangeOption(opt)()));
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
