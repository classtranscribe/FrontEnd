import React from 'react';
import { ScrollArea } from 'components/ScrollArea';
import { connectWithRedux } from 'screens/MediaSettings/controllers/epub';
import EpubChapterItem from './EpubChapterItem';
import InstructionHeading from './InstructionHeading';
import './index.scss';

function ChapterList({ chapters }) {
  return (
    <ScrollArea
      id="msp-ee-sch-list"
      className="msp-ee-sch"
      scrollClassName="msp-ee-sch-scroll"
      scrollToTopButton="left"
    >
      <InstructionHeading />

      <div className="ct-d-c ee-sch-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubChapterItem
            key={`ee-sch-ch-${chapter.id}`}
            chapter={chapter}
            chapterIndex={chapterIndex}
            canUndoSplit={chapterIndex > 0}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

export default connectWithRedux(ChapterList, ['chapters']);
