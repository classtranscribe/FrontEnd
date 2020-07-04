import React, { useEffect } from 'react';
import { CTFragment } from 'layout';
import { SignInPrompt, CourseCardList } from 'components';
import { ARRAY_INIT } from 'utils/constants';
import { user } from 'utils/user';
import { connectWithRedux, searchControl } from '../../controllers';

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
    resultListElement = <CourseCardList row courses={courseResult} />
  }

  return (
    <CTFragment padding={[0, 30]} className="mt-4">
      <hr />
      <CTFragment padding={[0, 10, 20, 10]} list>
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
