import React, { useEffect, Fragment } from 'react';
import { Sidebar } from 'semantic-ui-react';
import { CTHeading, altEl, CTFragment } from 'layout';
import { elem } from 'utils';
import { connectWithRedux } from '../../redux';
import { epub } from '../../controllers';
import NavTrigger from './NavTrigger';
import NavItem from './NavItem';
import './index.scss';


function ChapterNavigation({
  chapters,
  showNav,
  navId,
  children
}) {
  const open = epub.ctrl.isStep2 || showNav;

  useEffect(() => {
    if (navId && open) {
      elem.scrollIntoCenter(navId);
    }
  }, [navId, showNav]);

  const openBtnElement = altEl(NavTrigger, !epub.ctrl.isStep2, { open });

  return (
    <Sidebar.Pushable>
      <Sidebar
        id={epub.const.EPubNavigatorContainerID}
        animation="uncover"
        direction="left"
        icon='labeled'
        vertical
        visible={open}
        className="ct-epb ch-nav-con"
        data-scroll
      >
        <CTHeading sticky as="h3" icon="list" uppercase padding={[15, 20]}>
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
      </Sidebar>

      <Sidebar.Pusher className="w-100 h-100">
        {openBtnElement}

        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

export default connectWithRedux(
  ChapterNavigation,
  ['navId', 'showNav', 'chapters']
);
