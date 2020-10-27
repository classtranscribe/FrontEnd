import React, { Fragment, useEffect } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { uurl, elem } from 'utils';
import { epub, connectWithRedux } from '../../controllers';
const ID = epub.id;

function NavMenuItem({
  isSubCh,
  id,
  chapter,
  chIdx,
  schIdx,
  navId
}) {
  const navItemId = isSubCh ? ID.schNavItemID(id) : ID.chNavItemID(id);
  const current = navId === navItemId;
  const navTxt = isSubCh 
                ? `${chIdx + 1}.${schIdx + 1} - ${chapter.title}`
                : `${chIdx + 1} - ${chapter.title}`;

  const onNavigate = (e) => {
    e.preventDefault();
    if (isSubCh) {
      epub.nav.navigateSubChapter(id);
    } else {
      epub.nav.navigateChapter(id);
    }
  }

  const liClasses = cx('ct-epb nav-item', { current, sub: isSubCh });
  const navLink = uurl.createHash({ ch: id }, true);

  return (
    <li aria-current={current ? "true" : "false"}>
      <Link 
        title={navTxt} 
        id={navItemId} 
        to={navLink} 
        className={liClasses} 
        onClick={onNavigate}
      >
        <span tabIndex="-1">{navTxt}</span>
      </Link>
    </li>
  );
}

function NavigationMenu({
  view,
  navId,
  currChIndex,
  chapters = []
}) {

  const mightHideSubCh = view === epub.const.EpbEditChapter;
  useEffect(() => {
    if (navId) elem.scrollIntoCenter(navId);
  }, [navId]);

  return (
    <ul
      className="plain-ul"
      id={ID.EPubNavigationMenuID}
      aria-activedescendant={navId}
    >
      {chapters.map((ch, chIdx) => (
        <Fragment key={ch.id}>
          <NavMenuItem
            id={ch.id}
            chIdx={chIdx}
            chapter={ch}
            navId={navId}
          />
          {
            (ch.subChapters.length > 0 && (
              !mightHideSubCh || (
                mightHideSubCh && chIdx === currChIndex
              )
            ))
            &&
            <ul className="plain-ul">
              {ch.subChapters.map((sch, schIdx) => (
                <NavMenuItem
                  isSubCh
                  key={sch.id}
                  id={sch.id}
                  chIdx={chIdx}
                  schIdx={schIdx}
                  chapter={sch}
                  navId={navId}
                />
              ))}
            </ul>
          }
        </Fragment>
      ))}
    </ul>
  );
}

export default connectWithRedux(
  NavigationMenu,
  ['navId', 'chapters', 'view', 'currChIndex']
);
