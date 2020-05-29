import React, { useEffect } from 'react';
import { SignInPrompt } from 'components';
import { ARRAY_INIT } from 'utils/constants';
import { user } from 'utils/user';
import { connectWithRedux, searchControl } from '../../controllers';

import CourseResultItem from './CourseResultItem';

function SearchResultWithRedux(props) {
  let {
    offerings,
    searchValue,
    searchResult,
  } = props;
  
  useEffect(() => {
    if (offerings !== ARRAY_INIT) {
      searchControl.searchFor(searchValue);
    }
  }, [offerings, searchValue]);

  const { courseResult } = searchResult;

  let resultListElement = null;
  if (!courseResult) {
    resultListElement = null;
  } else if (courseResult.length === 0) {
    resultListElement = <div className="no-results"><span>No Results</span></div>;
  } else if (courseResult.length > 0) {
    resultListElement = courseResult.map(res => <CourseResultItem key={res.id} offering={res} />);
  }

  return (
    <div className="sp-result-con">
      <hr />
      <div role="list" className="sp-result-ul">
        {resultListElement}
      </div>
      
      {
        !user.isLoggedIn
        &&
        <SignInPrompt
          topDescription={<>Can&#39;t find your courses? <br />Sign in to see more.</>}
        />
      }
    </div>
  );
}

export const SearchResult = connectWithRedux(
  SearchResultWithRedux,
  ['offerings', 'searchValue', 'searchResult']
);
