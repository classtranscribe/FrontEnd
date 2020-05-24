import React from 'react';
import ImageMagnifier from './ImageMagnifier';
import ChapterList from './ChapterList';
import ChapterPreview from './ChapterPreview';
import ActionButtons from './ActionButtons';
import ProceedButton from './ProceedButton';
import './index.scss';

function SplitChapter() {
  return (
    <div
      id="msp-ee-sch-con"
      className="msp-ee-sch-con msp-ee-step-con ct-a-fade-in"
    >
      <ChapterList />
      <ChapterPreview />
      <ImageMagnifier />
      <ActionButtons />
      <ProceedButton />
    </div>
  );
}

export default SplitChapter;