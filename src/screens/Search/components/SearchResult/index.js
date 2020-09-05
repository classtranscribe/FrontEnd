import React, { useEffect } from 'react';
import { CTFragment } from 'layout';
import { CourseCardList } from 'components';
import { ARRAY_INIT } from 'utils/constants';
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
      <CTFragment padding={[0, 10, 20, 10]} dFlexCol>
        {resultListElement}
      </CTFragment>
    </CTFragment>
  );
}

export const SearchResult = connectWithRedux(
  SearchResultWithRedux,
  ['offerings', 'searchValue', 'searchResult']
);
