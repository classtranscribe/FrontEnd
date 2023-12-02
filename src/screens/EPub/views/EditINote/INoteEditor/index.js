import React, { useEffect } from 'react';
import { connect } from 'dva'
import './index.scss';

import INoteChapter from './INoteChapter';

function INoteEditor({ chapters = [], /* foldedIds = [], */ currChIndex, /* setINoteItem, */ dispatch }) {
  useEffect(() => {
    if (currChIndex > 0) {
      setTimeout(() => {
        dispatch({ type: 'epub/navigateChapter', payload: chapters[currChIndex].id });
      }, 500);
    }
  }, []);

  return (
    <ul className='ct-inote-editor'> 
      {chapters.map((chapter, chIdx) => (
        <INoteChapter 
          key={chapter.id}
          chapter={chapter}
          chapters={chapters} 
          chIdx={chIdx}
          isSubChapter={false}
          condition={chapter.condition}
          dispatch={dispatch}
        />
      ))}
    </ul>
  )
}

export default connect(({ epub: { currChIndex, epub: { chapters, images}, foldedIds } }) => ({
    currChIndex, chapters, images, foldedIds
  }))(INoteEditor); 