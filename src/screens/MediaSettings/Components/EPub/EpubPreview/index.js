import React, { useEffect, useState } from 'react';
import ChapterView from './ChapterView';
import Toolbar from './Toolbar';
import './index.scss';
import { connectWithRedux, epub } from '../../../Utils/epub';

var lastChapterId = '';

function EpubPreviewWithRedux({
  language,
  currChapter,
  isManagingChapters=false,
}) {

  const [txtEditor, setTxtEditor] = useState(epub.EDITOR_DISPLAY);
  const [adEditor, setADEditor] = useState(
    currChapter.audioDescription
    ? epub.EDITOR_DISPLAY 
    : epub.EDITOR_NONE
  );

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
    setTxtEditor(epub.EDITOR_DISPLAY);
  }, [isManagingChapters])

  return (
    <div data-scroll
      id="msp-ee-ep-con" 
      className="msp-ee-ep-con ct-a-fade-in"
      data-editing={isManagingChapters}
    >
      <ChapterView round
        shadow={isManagingChapters} 
        chapter={currChapter} 
        contentEditable={!isManagingChapters}
        txtEditor={txtEditor}
        adEditor={adEditor} 
        setADEditor={setADEditor}
      />

      {
        !isManagingChapters
        &&
        <Toolbar 
          chapter={currChapter} 
          language={language} 
          txtEditor={txtEditor}
          setTxtEditor={setTxtEditor}
          adEditor={adEditor} 
          setADEditor={setADEditor}
        />
      }
    </div>
  );
}

export default connectWithRedux(
  EpubPreviewWithRedux,
  [
    'isManagingChapters',
    'language',
    'currChapter'
  ],
  []
);
