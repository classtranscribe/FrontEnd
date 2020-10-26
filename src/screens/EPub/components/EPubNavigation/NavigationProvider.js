import React from 'react';
import cx from 'classnames';
import { CTFragment, CTHeading } from 'layout';
import { epub, connectWithRedux } from '../../controllers';
import NavigationTrigger from './NavigationTrigger';
import NavigationMenu from './NavigationMenu'


function NavigationProvider({
  showNav,
  children
}) {
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
  ['showNav']
);
