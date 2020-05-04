import React, { useEffect } from 'react';
import { connectWithRedux, epub } from 'screens/MediaSettings/Utils/epub';
import './index.scss';

import ChapterInfo from './ChapterInfo';
import SubChapterItem from './SubChapterItem';

function ChapterEditor({
  currChapter
}) {

  const { subChapters=[] } = currChapter;
  const screenshots = epub.getAllImagesInChapter(currChapter);

  useEffect(() => {
    // add event listener to preview panel's scrolling
    epub.addScrollEventListenerToEpubPreview();

    return () => {
      epub.removeScrollEventListenerToEpubPreview();
    }
  }, []);

  return (
    <div data-scroll 
      id="ee-ech-ch"
      className="ee-ech-ch-con"
    >
      <div className="ee-ech-ch">
        <ChapterInfo chapter={currChapter} screenshots={screenshots} />

        <div className="ee-ech-ch-subchapters">
          {subChapters.map((subChapter, subChapterIndex) => (
            <SubChapterItem
              key={'ee-ech-' + subChapter.id}
              subChapter={subChapter}
              subChapterIndex={subChapterIndex}
              screenshots={screenshots}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default connectWithRedux(
  ChapterEditor,
  ['currChapter']
);
