import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ARRAY_INIT } from 'utils';
import { CTLoader } from 'components';
import { epub, connectWithRedux } from '../../controllers/epub';
import './index.scss';

import RequestEpub from './RequestEpub';
import ChapterNavigator from './ChapterNavigator';
import SplitChapter from './Step1-SplitChapters';
import EditChapters from './Step2-EditChapters';
import EpubDownloader from './Step3-Download';

const { EPUB_STEP_SPLIT, EPUB_STEP_EDIT, EPUB_STEP_DOWNLOAD } = epub;

export function EpubWithRedux(props) {
  const { 
    step, 
    error, 
    media, 
    epubData = ARRAY_INIT, 
    chapters = ARRAY_INIT, 
    setChapters 
  } = props;

  let { hash } = useLocation();

  useEffect(() => {
    // register setState functions
    epub.state.init(props);

    return () => {
      setChapters(ARRAY_INIT);
      epub.resetEpubData();
    };
  }, []);
  
  useEffect(() => {
    // update step when hash changes
    let steps = [EPUB_STEP_SPLIT, EPUB_STEP_EDIT, EPUB_STEP_DOWNLOAD];

    let stepVal = hash.replace('#', '');
    if (steps.includes(stepVal)) {
      epub.state.setStep(stepVal);
    } else {
      epub.state.setStep(EPUB_STEP_SPLIT);
    }
  }, [hash]);

  useEffect(() => {
    if (media.id) {
      epub.state.setupEpub(media.id);
    }
  }, [media]);

  useEffect(() => {
    if (epubData !== ARRAY_INIT) {
      epub.sch.setupChapters(epubData);
    }
  }, [epubData]);

  useEffect(() => {
    epub.history.clear();
  }, [step])

  return error === epub.NO_EPUB ? (
    <RequestEpub mediaId={media.id} />
  ) : (
    <div className="msp-ee-con ct-a-fade-in">
      <div className="msp-ee">
        {chapters === ARRAY_INIT ? (
          <div className="w-100">
            <CTLoader />
          </div>
        ) : (
          <>
            <ChapterNavigator />

            {step === EPUB_STEP_SPLIT ? (
              <SplitChapter />
            ) : step === EPUB_STEP_EDIT ? (
              <EditChapters />
            ) : (
              <EpubDownloader />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  ['error', 'step', 'epubData', 'chapters'],
  ['all'],
  ['media'],
);
