import React, { useEffect } from 'react';
import { CTScrollArea } from 'layout';
import { elem } from 'utils/use-elem';
import { connectWithRedux } from '../../redux';
import { MDPreviewer } from '../../components';
import { CTEPubConstants as Constants } from '../../controllers';
import './index.scss';

let lastChapterId = null;

function ChapterPreview({ chapters, currChIndex }) {
  const { text, id } = chapters[currChIndex] || chapters[0];

  useEffect(() => {
    if (id !== lastChapterId) {
      elem.scrollToTop(Constants.SplitChapterMDPreviewerID);
      lastChapterId = id;
    }

    return () => {
      lastChapterId = null;
    };
  }, [currChIndex]);

  return (
    <CTScrollArea
      id={Constants.SplitChapterMDPreviewerID}
      className="ct-epb sch pview-con"
      scrollClassName="ct-epb sch pview-scroll"
      scrollToTopButton="right top"
    >
      <MDPreviewer value={text} className="ct-epb sch md-pview" />
    </CTScrollArea>
  );
}

export default connectWithRedux(
  ChapterPreview,
  ['currChIndex', 'chapters']
);
