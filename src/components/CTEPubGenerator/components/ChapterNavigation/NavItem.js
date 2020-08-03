import React from 'react';
import cx from 'classnames';
import { Button } from 'pico-ui';
import { CTEPubConstants as Constants, epub } from '../../controllers';

function NavItem({
  id,
  isSub,
  chIdx,
  schIdx,
  chapter,
  navId
}) {
  const navItemId = isSub ? Constants.schNavItemID(id) : Constants.chNavItemID(id);
  const current = navId === navItemId;
  const navTxt = isSub 
                ? `${chIdx + 1}.${schIdx + 1} - ${chapter.title}`
                : `${chIdx + 1} - ${chapter.title}`;

  const onNavigate = isSub
                    ? epub.nav.navigateSubChapter
                    : epub.nav.navigateChapter;

  return (
    <Button
      id={navItemId}
      role="menuitem"
      className={cx('ct-epb', 'ch-nav-item', { sub: isSub })}
      color={current ? 'teal' : 'transparent'}
      onClick={() => onNavigate(id)}
      title={navTxt}
    >
      {navTxt}
    </Button>
  )
}

export default NavItem
