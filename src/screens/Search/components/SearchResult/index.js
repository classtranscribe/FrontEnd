import React from 'react';
import { CTFragment } from 'layout';
import { CourseCardList } from 'components';

function SearchResultWithRedux(props) {
  const {search} = props;
  let { searchResult } = search;
  
  const { courseResult } = searchResult;

  let resultListElement = null;
  if (!courseResult) {
    resultListElement = <div className='sr-only' aria-busy>Results will appear here</div>;
  } else if (courseResult.length === 0) {
    resultListElement = <div className="no-results" aria-live="polite"><span>No Results</span></div>;
  } else if (courseResult.length > 0) {
    resultListElement = <div aria-live="polite" aria-label={`${courseResult.length} results`}><CourseCardList row courses={courseResult} /></div>
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