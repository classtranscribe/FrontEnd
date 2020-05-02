import React, { useEffect } from 'react';
import { PlaceHolder } from 'components';

import RequestEpub from './RequestEpub';
import EpubChapters from './EpubChapters';
import EpubPreview from './EpubPreview';
import CoverPicker from './CoverPicker';
import ActionButtons from './ActionButtons';
import ChapterNavigator from './ChapterNavigator';
import './index.scss';

import { ARRAY_INIT } from 'utils';

import { 
  epub,
  connectWithRedux
} from '../../Utils/epub';

const firstTimeEdit = true;

export function EpubWithRedux(props) {

  const {
    error,
    media,
    epubData = ARRAY_INIT,
    chapters = ARRAY_INIT, 
    coverImgs,
    setChapters,
  } = props;

  useEffect(() => {
    if (media.id) {
      epub.state.setupEpub(media.id);
    }
  }, [media]);

  useEffect(() => {
    if (epubData !== ARRAY_INIT) {
      if (firstTimeEdit) {
        epub.setupChapters(epubData);
      } else {
        setChapters(epubData);
      }
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

  if (error === epub.NO_EPUB) return <RequestEpub mediaId={media.id} />;

  return (
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

            <EpubChapters />

            <EpubPreview />

            {
              coverImgs.length > 0
              &&
              <CoverPicker />
            }

            <ActionButtons />
          </>
        }
      </div>
    </div>
  );
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  [
    'error', 'epubData', 
    'chapters',
    'coverImgs'
  ],
  ['all'],
  ['media']
);