import React, { Fragment, useEffect } from 'react';
import { CTFragment, CTHeading } from 'layout';
import { elem } from 'utils';
import { CTEPubConstants as Constants } from '../../controllers';
import NavItem from './NavItem';

function ChapterNavigationMenu({
  chapters,
  currChIndex,
  navId,
  autoScrollToNavItem,
  displaySChOnlyForCurrCh
}) {
  useEffect(() => {
    if (autoScrollToNavItem) {
      elem.scrollIntoCenter(navId);
    }
  }, [navId, autoScrollToNavItem]);

  return (
    <CTFragment>
      <CTHeading sticky as="h3" icon="list" uppercase padding={[15, 20]} margin="0">
        Chapters
      </CTHeading>

      <CTFragment 
        list 
        role="menu" 
        id={Constants.EPubChapterNavListID}
        margin={[2, 0]}
      >
        {chapters.map((chp, chIdx) => (
          <Fragment key={chp.id}>
            <NavItem navId={navId} id={chp.id} chIdx={chIdx} chapter={chp} />

            {
              (displaySChOnlyForCurrCh && chIdx !== currChIndex) ? null :
              chp.subChapters.map((schp, schIdx) => (
                <NavItem
                  key={schp.id}
                  isSub
                  navId={navId}
                  id={schp.id}
                  chIdx={chIdx}
                  schIdx={schIdx}
                  chapter={schp}
                />
              ))
            }
          </Fragment>
        ))}
      </CTFragment>
    </CTFragment>
  );
}

export default ChapterNavigationMenu;
