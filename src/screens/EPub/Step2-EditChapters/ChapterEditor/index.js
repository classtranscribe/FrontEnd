import React, { useEffect } from 'react';
import { CTScrollArea, CTFragment } from 'layout';
import { elem } from 'utils';
import { epub, getAllImagesInChapter } from '../../controllers';
import { connectWithRedux } from '../../redux';
import ChapterInfo from './ChapterInfo';
import SubChapterItem from './SubChapterItem';
import './index.scss';

function ChapterEditor({ chapters, currChIndex }) {
  const currChapter = chapters[currChIndex] || {};
  const { subChapters = [] } = currChapter;
  const screenshots = epub.data.data.images;
  const chapterScreenshots = getAllImagesInChapter(currChapter);

  useEffect(() => {
    // add event listener to preview panel's scrolling
    epub.nav.addScrollListenerForChapterList();
    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  useEffect(() => {
    elem.scrollToTop(epub.const.EPubChapterListID);
  }, [currChIndex]);

  return (
    <CTScrollArea
      id={epub.const.EPubChapterListID}
      className="ct-epb ech ch-con"
      scrollClassName="ct-epb ech ech-scroll"
      scrollToTopButton="right"
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
    </CTScrollArea>
  );
}

export default connectWithRedux(
  ChapterEditor, 
  ['currChIndex', 'chapters']
);