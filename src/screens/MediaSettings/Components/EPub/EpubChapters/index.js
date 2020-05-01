import React from 'react';
import { connectWithRedux } from '../../../Utils';
import EpubChapterItem from './EpubChapterItem';
import EpubHeader from './EpubHeader';
import ImageMagnifier from './ImageMagnifier'
import './index.scss';

function EpubChaptersWithRedux({
  chapters=[],
  language,
  magnifiedImg,
  foldedIds,

  epubData,
  isEditingEpub=false,
}) {

  // console.log('chapters', chapters)

  return (
    <div data-scroll
      id="msp-ee-el-con"
      className="msp-ee-el-con ct-d-c ct-a-fade-in" 
      data-editing={isEditingEpub}
    >
      <EpubHeader
        epubData={epubData}
        chapters={chapters}
        language={language}
      />

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubChapterItem 
            key={`ee-el-ch-${chapterIndex}`} 
            chapter={chapter}
            chapterIndex={chapterIndex}
            foldedIds={foldedIds}
            canUndoSplit={chapterIndex > 0}
          />
        ))}
      </div>

      <ImageMagnifier magnifiedImg={magnifiedImg} />
    </div>
  );
}

export default connectWithRedux(
  EpubChaptersWithRedux,
  ['isEditingEpub', 'epubData'],
  []
);
