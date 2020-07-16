import React from 'react';
import { CTEPubConstants as Constants } from '../controllers';
import ImageMagnifier from './ImageMagnifier';
import ChapterList from './ChapterList';
import ChapterPreview from './ChapterPreview';
// import ActionButtons from './ActionButtons';
import ProceedButton from './ProceedButton';
import './index.scss';

function SplitChapter() {
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