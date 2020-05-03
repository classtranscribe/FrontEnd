import React, { useEffect, useState } from 'react';
import ChapterView from './ChapterView';
import Toolbar from './Toolbar';
import './index.scss';
import { connectWithRedux, epub } from '../../../Utils/epub';

var lastChapterId = '';

function EpubPreviewWithRedux({
  currChapter,
  isManagingChapters=false,
  txtEditor,

  setTxtEditor,
}) {

  useEffect(() => {
    // Scroll the preview to top everytime the chapter changed
    if (currChapter.id !== lastChapterId) {
      let previewEl = document.getElementById('msp-ee-ep-con');
      if (previewEl) {
        previewEl.scrollTop = 0;
      }
      setTxtEditor(epub.EDITOR_DISPLAY);
    }
    lastChapterId = currChapter.id;
  }, [currChapter]);

  useEffect(() => {
    if (txtEditor !== epub.EDITOR_DISPLAY) {
      setTxtEditor(epub.EDITOR_DISPLAY);
    }
  }, [isManagingChapters])

  return (
    <div data-scroll
      id="msp-ee-ep-con" 
      className="msp-ee-ep-con ct-a-fade-in"
      data-managing={isManagingChapters}
      data-editing={txtEditor !== epub.EDITOR_DISPLAY}
    >
      <ChapterView round
        shadow={isManagingChapters} 
        chapter={currChapter} 
        contentEditable={!isManagingChapters}
        txtEditor={txtEditor}
      />

      {
        !isManagingChapters
        &&
        <Toolbar />
      }
    </div>
  );
}

export default connectWithRedux(
  EpubPreviewWithRedux,
  [
    'isManagingChapters',
    'currChapter',
    'txtEditor'
  ],
  [
    'setTxtEditor'
  ]
);
