import React, { useEffect } from 'react';
import cx from 'classnames';
import { CTFragment, CTHeading } from 'layout';
import { uurl, elem } from 'utils';
import { epub, connectWithRedux } from '../../controllers';
import NavigationTrigger from './NavigationTrigger';
import NavigationMenu from './NavigationMenu'


function NavigationProvider({
  chapters,
  showNav,
  currChIndex,
  children
}) {
  useEffect(() => {
    const { title } = uurl.useHash();
    if (title) {
      elem.scrollIntoCenter(title);
    }

    if (chapters.length > 0) {
      epub.state.setNavId(epub.id.chNavItemID(chapters[currChIndex].id));
    }
  }, []);

  return (
    <CTFragment id={epub.id.EPubNavigationProviderID} dFlex>
      <NavigationTrigger show={showNav} />

      <div className={cx('ct-epb nav-con', { show: showNav })}>
        <CTHeading as="h3" uppercase sticky fadeIn={false}>Chapters</CTHeading>
        <NavigationMenu />
      </div>

      <div className={cx('ct-epb nav-main', { 'show-nav': showNav })}>
        {children}
      </div>
    </CTFragment>
  );
}

export default connectWithRedux(
  NavigationProvider,
  ['showNav', 'chapters', 'currChIndex']
);
