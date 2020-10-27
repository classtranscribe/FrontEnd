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
  const screenshots = epub.data.data.images;
  const chapterScreenshots = epub.data.data.chapters[currChIndex].allImagesWithIn;

  useEffect(() => {
    elem.scrollToTop(epub.id.EPubChapterListID);
  }, [currChIndex]);

  return (
    <CTFragment
      className="ct-epb ech ch-con"
      //scrollClassName="ct-epb ech ech-scroll"
    >
      <ChapterInfo
        chapter={currChapter}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
      />

      <CTFragment dFlexCol role="list">
        {subChapters.map((subChapter, subChapterIndex) => (
          <SubChapterItem
            key={`ee-ech-${subChapter.id}`}
            subChapter={subChapter}
            subChapterIndex={subChapterIndex}
            screenshots={screenshots}
            chapterScreenshots={chapterScreenshots}
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