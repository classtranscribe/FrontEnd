import React, { useEffect, useState } from 'react';
import ChapterView from './ChapterView';
import Toolbar from './Toolbar';
import './index.scss';
import { connectWithRedux, EDITOR_DISPLAY, EDITOR_NONE } from '../../../Utils';

var lastChapterId = '';

function EpubPreviewWithRedux({
  language,
  currChapter,
  isEditingEpub=false,
}) {

  const [txtEditor, setTxtEditor] = useState(EDITOR_DISPLAY);
  const [adEditor, setADEditor] = useState(
    currChapter.audioDescription
    ? EDITOR_DISPLAY 
    : EDITOR_NONE
  );

  useEffect(() => {
    // Scroll the preview to top everytime the chapter changed
    if (currChapter.id !== lastChapterId) {
      let previewEl = document.getElementById('msp-ee-ep-con');
      if (previewEl) {
        previewEl.scrollTop = 0;
      }
      setTxtEditor(EDITOR_DISPLAY);
    }
    lastChapterId = currChapter.id;
  }, [currChapter]);

  useEffect(() => {
    setTxtEditor(EDITOR_DISPLAY);
  }, [isEditingEpub])

  return (
    <div data-scroll
      id="msp-ee-ep-con" 
      className="msp-ee-ep-con ct-a-fade-in"
      data-editing={isEditingEpub}
    >
      <ChapterView round
        shadow={isEditingEpub} 
        chapter={currChapter} 
        contentEditable={!isEditingEpub}
        txtEditor={txtEditor}
        adEditor={adEditor} 
        setADEditor={setADEditor}
      />

      {
        !isEditingEpub
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
  ['isEditingEpub'],
  []
);
