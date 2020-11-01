import React, { useEffect } from 'react';
import { CTFragment } from 'layout';
import { elem } from 'utils/use-elem';
import { epub, connectWithRedux } from '../../../controllers';
import ChapterInfo from './ChapterInfo';
import SubChapterItem from './SubChapterItem';
import './index.scss';

function ChapterEditor({ chapters, currChIndex }) {
  const currChapter = chapters[currChIndex] || {};
  const { subChapters = [] } = currChapter;

  useEffect(() => {
    elem.scrollToTop(epub.id.EPubChapterListID);
  }, [currChIndex]);

  return (
    <CTFragment className="ct-epb ech ch-con" shadowed>
      <ChapterInfo chapter={currChapter} />

      <CTFragment dFlexCol role="list">
        {subChapters.map((subChapter, subChapterIndex) => (
          <SubChapterItem
            key={`ee-ech-${subChapter.id}`}
            subChapter={subChapter}
            subChapterIndex={subChapterIndex}
          />
        ))}
      </CTFragment>
    </CTFragment>
  );
}

export default connectWithRedux(
  ChapterEditor, 
  ['currChIndex', 'chapters']
);