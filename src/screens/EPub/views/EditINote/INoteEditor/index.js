
import React, { useEffect, useState } from 'react';
import { connect } from 'dva'
import './index.scss';


import INoteChapter from './INoteChapter';

function INoteEditor({ chapters = [], foldedIds = [], currChIndex, setINoteItem, dispatch }) {
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
          chIdx={chIdx}
          isSubChapter={false}
          dispatch={dispatch}
        />
      ))}
    </ul>
  )
}

export default connect(({ epub: { currChIndex, epub: { chapters, images}, foldedIds }, loading }) => ({
    currChIndex, chapters, images, foldedIds
  }))(INoteEditor); 