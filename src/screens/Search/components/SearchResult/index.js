import React, { useEffect } from 'react';
import { CTFragment } from 'layout';
import { CourseCardList } from 'components';
import { ARRAY_INIT } from 'utils/constants';

function SearchResultWithRedux(props) {
  const {search} = props;
  let { searchResult } = search;
  
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

export default SearchResultWithRedux;