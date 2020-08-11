import React, { useEffect } from 'react';
import { Sidebar } from 'semantic-ui-react';
import { altEl } from 'layout';
import { elem } from 'utils';
import { connectWithRedux } from '../../redux';
import { epub } from '../../controllers';
import NavTrigger from './NavTrigger';
import ChapterNavigationMenu from './ChapterNavigationMenu';
import './index.scss';


function ChapterNavigationProvider({
  chapters,
  showNav,
  navId,
  children
}) {
  const open = epub.ctrl.isStep2 || showNav;

  useEffect(() => {
    if (navId && open) {
      elem.scrollIntoCenter(navId, { focus: false });
    }
  }, [navId, showNav]);

  const openBtnElement = altEl(NavTrigger, !epub.ctrl.isStep2, { open });

  return (
    <Sidebar.Pushable className="w-100">
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
        <ChapterNavigationMenu 
          autoScrollToNavItem={navId && open} 
          chapters={chapters} 
          navId={navId}
        />
      </Sidebar>

      <Sidebar.Pusher className="w-100 h-100 ct-epb ch-nav-main">
        {openBtnElement}

        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

export default connectWithRedux(
  ChapterNavigationProvider,
  ['navId', 'showNav', 'chapters']
);
