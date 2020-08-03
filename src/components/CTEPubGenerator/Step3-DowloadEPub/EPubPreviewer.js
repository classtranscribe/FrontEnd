import React, { useEffect } from 'react';
import { CTFragment, CTHeading, CTScrollArea } from 'layout';
import { EPubStepper, MDPreviewer } from '../components';
import { epub, buildMDFromChapters } from '../controllers';

function EPubPreviewer({ chapters, title }) {
  const epubHTML = buildMDFromChapters(chapters);

  useEffect(() => {
    epub.nav.addScrollListenerForChapterList();
    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  return (
    <CTScrollArea 
      id={epub.const.EPubChapterListID}
      className="ct-epb dch-preview-con"
      scrollClassName="ct-epb dch-preview-con-scroll"
      scrollToTopButton="bottom right"
    >
      <EPubStepper />
      <CTHeading>{title}</CTHeading>
      <CTFragment padding={[0, 30]}>
        <MDPreviewer value={epubHTML} />
      </CTFragment>
    </CTScrollArea>
  );
}

export default EPubPreviewer;
