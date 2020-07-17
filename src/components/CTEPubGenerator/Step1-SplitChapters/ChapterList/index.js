import React from 'react';
import { CTScrollArea } from 'layout';
import { CTEPubConstants as Constants } from '../../controllers';
import { connectWithRedux } from '../../redux';
import EPubChapterItem from './EPubChapterItem';
import InstructionHeading from './InstructionHeading';
import './index.scss';

function ChapterList({ chapters }) {
  return (
    <CTScrollArea
      id={Constants.EPubChapterListID}
      className="ct-epb sch-con"
      scrollClassName="ct-epb sch-scroll"
      scrollToTopButton="left"
    >
      <InstructionHeading />

      <div className="ct-d-c ee-sch-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EPubChapterItem
            key={chapter.id}
            chapter={chapter}
            chapterIndex={chapterIndex}
            canUndoSplit={chapterIndex > 0}
          />
        ))}
      </div>
    </CTScrollArea>
  );
}

export default connectWithRedux(ChapterList, ['chapters']);
