import React, { useEffect } from 'react';
import { CTEPubConstants as Constants, epub } from '../controllers';
import ImageMagnifier from './ImageMagnifier';
import ChapterList from './ChapterList';
import ChapterPreview from './ChapterPreview';
// import ActionButtons from './ActionButtons';
import ProceedButton from './ProceedButton';
import './index.scss';

function SplitChapter() {
  useEffect(() => {
    epub.nav.addScrollListenerForChapterList();

    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  return (
    <div
      id={Constants.SplitChapterContainerID}
      className="ct-epb step-con ct-a-fade-in"
    >
      <ChapterList />
      <ChapterPreview />
      <ImageMagnifier />
      {/* <ActionButtons /> */}
      <ProceedButton />
    </div>
  );
}

export default SplitChapter;