import React, { Fragment } from 'react';
import { CTFragment, CTHeading } from 'layout';
import NavItem from './NavItem';

function ChapterNavigationMenu({
  chapters,
  navId
}) {
  return (
    <CTFragment>
      <CTHeading sticky as="h3" icon="list" uppercase padding={[15, 20]} margin="0">
        Chapters
      </CTHeading>

      <CTFragment list role="menu">
        {chapters.map((chp, chIdx) => (
          <Fragment key={chp.id}>
            <NavItem navId={navId} id={chp.id} chIdx={chIdx} chapter={chp} />

            {chp.subChapters.map((schp, schIdx) => (
              <NavItem
                key={schp.id}
                isSub
                navId={navId}
                id={schp.id}
                chIdx={chIdx}
                schIdx={schIdx}
                chapter={schp}
              />
            ))}
          </Fragment>
        ))}
      </CTFragment>
    </CTFragment>
  );
}

export default ChapterNavigationMenu;
