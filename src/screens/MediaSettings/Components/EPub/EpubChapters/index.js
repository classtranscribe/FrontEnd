import React from 'react';
import { connectWithRedux } from '../../../Utils/epub';
import EpubChapterItem from './EpubChapterItem';
import EpubHeader from './EpubHeader';
import ImageMagnifier from './ImageMagnifier'
import './index.scss';

function EpubChaptersWithRedux({
  chapters=[],
  isManagingChapters=false,
}) {

  // console.log('chapters', chapters)

  return (
    <div data-scroll
      id="msp-ee-el-con"
      className="msp-ee-el-con ct-d-c ct-a-fade-in" 
      data-managing={isManagingChapters}
    >
      <EpubHeader />

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubChapterItem 
            key={`ee-el-ch-${chapterIndex}`} 
            chapter={chapter}
            chapterIndex={chapterIndex}
            canUndoSplit={chapterIndex > 0}
          />
        ))}
      </div>

      <ImageMagnifier />
    </div>
  );
}

export default connectWithRedux(
  EpubChaptersWithRedux,
  [
    'isManagingChapters', 
    'chapters'
  ],
  []
);
