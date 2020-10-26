import React, { Fragment } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { uurl } from 'utils/use-url';
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

  const onNavigate = () => epub.state.setNavId(navItemId);

  const liClasses = cx('ct-epb nav-item', { current, sub: isSubCh });
  const navLink = uurl.createHash({ ch: id }, true);

  return (
    <li>
      <Link id={navItemId} to={navLink} className={liClasses} onClick={onNavigate}>
        <span tabIndex="-1">{navTxt}</span>
      </Link>
    </li>
  );
}

function NavigationMenu({
  navId,
  chapters = []
}) {
  return (
    <ul className="plain-ul" id={ID.EPubNavigationMenuID}>
      {chapters.map((ch, chIdx) => (
        <Fragment key={ch.id}>
          <NavMenuItem
            id={ch.id}
            chIdx={chIdx}
            chapter={ch}
            navId={navId}
          />
          {
            ch.subChapters.length > 0
            &&
            <ul>
              {ch.subChapters.map((sch, schIdx) => (
                <NavMenuItem
                  isSubCh
                  key={ch.id}
                  id={ch.id}
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
  ['navId', 'chapters']
);
