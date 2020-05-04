import React from 'react';
import { connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import EpubChapterItem from './EpubChapterItem';
import InstructionHeading from './InstructionHeading';
import './index.scss';

function ChapterList({
  chapters
}) {
  return (
    <div id="msp-ee-sch-list" className="msp-ee-sch" data-scroll>
      <InstructionHeading />

      <div className="ct-d-c ee-sch-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubChapterItem
            key={`ee-sch-ch-${chapterIndex}`} 
            chapter={chapter}
            chapterIndex={chapterIndex}
            canUndoSplit={chapterIndex > 0}
          />
        ))}
      </div>
    </div>
  );
}

export default connectWithRedux(
  ChapterList,
  ['chapters']
);
