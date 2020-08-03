import React, { useEffect } from 'react';
import { CTScrollArea } from 'layout';
import { elem } from 'utils/use-elem';
import { connectWithRedux } from '../../redux';
import { MDPreviewer } from '../../components';
import { epub, buildMDFromChapter } from '../../controllers';
import './index.scss';

let lastChapterId = null;

function ChapterPreview({ chapters, currChIndex }) {
  const currChapter = chapters[currChIndex] || chapters[0];
  const { id } = currChapter;

  useEffect(() => {
    if (id !== lastChapterId) {
      elem.scrollToTop(epub.const.SplitChapterMDPreviewerID);
      lastChapterId = id;
    }

    return () => {
      lastChapterId = null;
    };
  }, [currChIndex]);

  return (
    <CTScrollArea
      id={epub.const.SplitChapterMDPreviewerID}
      className="ct-epb sch pview-con"
      scrollClassName="ct-epb sch pview-scroll"
      scrollToTopButton="top right"
      onClick={epub.nav.closeNavigator}
    >
      <MDPreviewer value={buildMDFromChapter(currChapter)} className="ct-epb sch md-pview" />
    </CTScrollArea>
  );
}

export default connectWithRedux(
  ChapterPreview,
  ['currChIndex', 'chapters']
);
