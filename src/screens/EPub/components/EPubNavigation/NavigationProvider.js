import React, { useEffect } from 'react';
import cx from 'classnames';
import { CTFragment, CTHeading } from 'layout';
import { connect } from 'dva'
import { epub as OldEpub } from '../../controllers';
import NavigationTrigger from './NavigationTrigger';
import NavigationMenu from './NavigationMenu'


function NavigationProvider({
  epub,
  showNav,
  currChIndex,
  // user props
  wider,
  defaultClosed,
  children,
  dispatch
}) {
  const { chapters = [] } = epub;
  useEffect(() => {
    if (chapters.length > 0) {
      dispatch({ type: 'epub/setNavId', payload: OldEpub.id.chNavItemID(chapters[currChIndex].id) });
    }

    if (defaultClosed) {
      dispatch({ type: 'epub/setShowNav', payload: false });
    }
  }, []);

  const hidden = showNav ? "false" : "true";
  const onNavModeToggle = () => {
    dispatch({ type: 'epub/setShowNav', payload: !showNav })
  }
  return (
    <CTFragment id={OldEpub.id.EPubNavigationProviderID} dFlex className={cx({ wider })}>
      <NavigationTrigger show={showNav} onToggle={onNavModeToggle} />

      <div aria-hidden={hidden} className={cx('ct-epb nav-con', { show: showNav })}>
        <CTHeading as="h3" uppercase sticky fadeIn={false}>Chapters</CTHeading>
        <NavigationMenu />
      </div>

      <div className={cx('ct-epb nav-main', { 'show-nav': showNav })}>
        {children}
      </div>
    </CTFragment>
  );
}
export default connect(({ epub: { epub, showNav, currChIndex }, loading }) => ({
  epub, showNav, currChIndex
}))(NavigationProvider);