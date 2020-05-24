import React, { useEffect } from 'react';
import { ScrollArea } from 'components/ScrollArea';
import { connectWithRedux, epub } from 'screens/MediaSettings/controllers/epub';
import './index.scss';

import ChapterInfo from './ChapterInfo';
import SubChapterItem from './SubChapterItem';

function ChapterEditor({ chapters, currChapter }) {
  const { subChapters = [] } = currChapter;
  const screenshots = epub.getAllImagesInChapters(chapters);
  const chapterScreenshots = epub.getAllImagesInChapter(currChapter);

  useEffect(() => {
    // add event listener to preview panel's scrolling
    epub.nav.addScrollEventListenerToEpubPreview();

    return () => {
      epub.nav.removeScrollEventListenerToEpubPreview();
    };
  }, []);

  return (
    <ScrollArea
      id="ee-ech-ch"
      className="ee-ech-ch-con"
      scrollClassName="ee-ech-ch"
      scrollToTopButton="right"
    >
      <ChapterInfo
        chapter={currChapter}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
      />

      <div className="ee-ech-ch-subchapters">
        {subChapters.map((subChapter, subChapterIndex) => (
          <SubChapterItem
            key={`ee-ech-${subChapter.id}`}
            subChapter={subChapter}
            subChapterIndex={subChapterIndex}
            screenshots={screenshots}
            chapterScreenshots={chapterScreenshots}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

export default connectWithRedux(ChapterEditor, ['currChapter', 'chapters']);
