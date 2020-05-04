import React, { useEffect } from 'react';
import { ARRAY_INIT } from 'utils';
import { epub, connectWithRedux } from '../../Utils/epub';
import { PlaceHolder } from 'components';
import './index.scss';

import RequestEpub from './RequestEpub';
import ChapterNavigator from './ChapterNavigator';
import SplitChapter from './Step1-SplitChapters';
import EditChapters from './Step2-EditChapters';


const { EPUB_STEP_SPLIT, EPUB_STEP_EDIT } = epub;


export function EpubWithRedux(props) {
  const {
    step,
    error,
    media,
    epubData = ARRAY_INIT,
    chapters = ARRAY_INIT, 
    setChapters,
  } = props;

  useEffect(() => {
    if (media.id) {
      epub.state.setupEpub(media.id);
    }
  }, [media]);

  useEffect(() => {
    if (epubData !== ARRAY_INIT) {
      epub.setupChapters(epubData);
    }
  }, [epubData]);

  useEffect(() => {
    // register setState functions
    epub.state.init(props);

    return () => {
      setChapters(ARRAY_INIT);
      epub.resetEpubData();
    }
  }, []);


  return error === epub.NO_EPUB ? (
    <RequestEpub mediaId={media.id} />
  ) : (
    <div className="msp-ee-con ct-a-fade-in">
      <div className="msp-ee">
        {
          chapters === ARRAY_INIT
          ?
          <div className="w-100">
            <PlaceHolder />
          </div>
          :
          <>
            <ChapterNavigator />

            {
              step === EPUB_STEP_SPLIT
              ?
              <SplitChapter />
              :
              step === EPUB_STEP_EDIT
              ?
              <EditChapters />
              :
              null
            }
          </>
        }
      </div>
    </div>
  );
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  [
    'error', 
    'step',
    'epubData', 
    'chapters',
  ],
  ['all'],
  ['media']
);