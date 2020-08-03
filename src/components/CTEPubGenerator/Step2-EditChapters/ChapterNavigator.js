import React, { useEffect } from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../redux';
import { ChapterNavigationMenu } from '../components';
import { epub } from '../controllers';

function ChapterNavigator({ navId, chapters, currChIndex }) {
  const currChapter = chapters[currChIndex] || {};

  useEffect(() => {
    if (currChapter.id) {
      epub.state.setNavId(epub.const.chNavItemID(currChapter.id));
    }
  }, []);

  return (
    <CTFragment
      id={epub.const.EPubNavigatorContainerID}
      className="ct-epb ech nav-con"
      data-scroll
    >
      <ChapterNavigationMenu 
        navId={navId} 
        chapters={chapters}
        currChIndex={currChIndex}
        autoScrollToNavItem={Boolean(navId)}
        displaySChOnlyForCurrCh
      />
    </CTFragment>
  );
}

export default connectWithRedux(
  ChapterNavigator,
  ['navId', 'chapters', 'currChIndex']
);
