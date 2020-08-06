import React, { useEffect } from 'react';
import { ChapterNavigationProvider } from '../components';
import { CTEPubConstants as Constants, epub } from '../controllers';
import ChapterList from './ChapterList';
import ChapterPreview from './ChapterPreview';
import EPubItemCarousel from './EPubItemCarousel';
import ProceedButton from './ProceedButton';
import UndoRedoButtons from './UndoRedoButtons';
// import ImageMagnifier from './ImageMagnifier';
import './index.scss';

function SplitChapter() {
  useEffect(() => {
    epub.nav.addScrollListenerForChapterList();

    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  return (
    <ChapterNavigationProvider>
      <div
        id={Constants.SplitChapterContainerID}
        className="ct-epb step-con split-ch-con ct-a-fade-in"
      >
        <ChapterList />
        <ChapterPreview />
        <UndoRedoButtons />
        <ProceedButton />
        <EPubItemCarousel />
      </div>
    </ChapterNavigationProvider>
  );
}

export default SplitChapter;