import React, { useEffect } from 'react';
import { SignInPrompt, CTFragment } from 'components';
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
    <CTFragment padding={[0, 30]} className="mt-4">
      <hr />
      <CTFragment padding={[0, 10, 20, 10]} list role="list">
        {resultListElement}
      </CTFragment>

      {
        !user.isLoggedIn
        &&
        <SignInPrompt
          topDescription={<>Can&#39;t find your courses? <br />Sign in to see more.</>}
        />
      }
    </CTFragment>
  );
}

export const SearchResult = connectWithRedux(
  SearchResultWithRedux,
  ['offerings', 'searchValue', 'searchResult']
);
