import React, { useEffect } from 'react';
import { CTFragment, CTHeading } from 'layout';
import { EPubStepper, MDPreviewer } from '../components';
import { epub, buildMDFromChapters } from '../controllers';

function EPubPreviewer({ chapters, title }) {
  const epubHTML = buildMDFromChapters(chapters);

  useEffect(() => {
    epub.nav.addScrollListenerForChapterList();
    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  return (
    <CTFragment 
      id={epub.const.EPubChapterListID}
      className="ct-epb dch-preview-con" 
      data-scroll
    >
      <EPubStepper />
      <CTHeading>{title}</CTHeading>
      <CTFragment padding={[0, 30]}>
        <MDPreviewer value={epubHTML} />
      </CTFragment>
    </CTFragment>
  );
}

export default EPubPreviewer;
