import React, { Fragment, useEffect, useState } from 'react';
import cx from 'classnames';
import { Link } from 'dva/router';
import { connect } from 'dva'
import { uurl, elem } from 'utils';
// import { findChapterTimeSpan } from 'entities/EPubs/utils';
// import Text from 'layout/CTText/Text';
import { CTFragment, CTCheckbox} from 'layout';
import { Checkbox } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import TagIcon from '@material-ui/icons/LabelOutlined'
import { epub } from '../../controllers';
import TagGroup from '../Tags/TagGroup';



const ID = epub.id;

function NavMenuItem({
  isSubCh,
  id,
  chapter,
  chIdx,
  schIdx,
  navId,
  isTag,
  needBox,
  selectedChapters,
  setSelectedChapters,
  isSelected,
  dispatch
}) {
  const navItemId = isSubCh ? ID.schNavItemID(id) : ID.chNavItemID(id);
  const current = navId === navItemId;
  const navTxt = isSubCh
    ? `${chIdx + 1}.${schIdx + 1} - ${chapter.title}`
    : `${chIdx + 1} - ${chapter.title}`;

  const onNavigate = (e) => {
    e.preventDefault();
    if (isSubCh) {
      dispatch({ type: 'epub/navigateSubChapter', payload: id })
    } else {
      dispatch({ type: 'epub/navigateChapter', payload: id });
    }
  }

  const liClasses = cx('ct-epb nav-item', { current, sub: isSubCh });
  const navLink = uurl.createHash({ h: id }, true);

  const handleCheck = (childIndex) => {
    if (selectedChapters.includes(childIndex)) {
      setSelectedChapters(selectedChapters.filter((val) => val !== chIdx));
    } else {
      setSelectedChapters([...selectedChapters, childIndex]);
    }
  };
  const checkBoxClasses = CTCheckbox.useStyles();
  const checkBox = (
    <Checkbox
      classes={checkBoxClasses}
      onChange={() => handleCheck(chIdx)}
      checked={isSelected(chIdx)}
    />
  );

  return (
    <li aria-current={current ? "true" : "false"} className="nav-item-li">
      {needBox? isTag && checkBox
      : <></> }
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
  chapters = [],
  dispatch
}) {
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(true);
  const isSelected = (chIdx) => {
    return selectedChapters.includes(chIdx);
  };

  const mightHideSubCh = view === epub.const.EpbEditChapter;
  useEffect(() => {
    if (navId) elem.scrollIntoCenter(navId);
  }, [navId]);

  return (
    <div>
      {showCheckbox?
        <CTFragment margin="10" padding={[5, 10]} width="auto">
          <ButtonGroup fullWidth>
            <Button startIcon={<TagIcon />} onClick={()=>setShowCheckbox(!showCheckbox)}>Hide Tags</Button> 
          </ButtonGroup>
        </CTFragment>
    :
        <CTFragment margin="10" padding={[5, 10]} width="auto">
          <ButtonGroup fullWidth>
            <Button startIcon={<TagIcon />} onClick={()=>setShowCheckbox(!showCheckbox)}>Show Tags</Button> 
          </ButtonGroup>
        </CTFragment>}
      {showCheckbox?
        <TagGroup 
          chapters={chapters}
          selectedChapters={selectedChapters}
          setSelectedChapters={setSelectedChapters}
          dispatch={dispatch}
        />:
        <></>}
      <ul
        className="plain-ul"
        id={ID.EPubNavigationMenuID}
      >
        {chapters.map((ch, chIdx) => (
          <Fragment key={ch.id}>
            <NavMenuItem
              id={ch.id}
              chIdx={chIdx}
              chapter={ch}
              navId={navId}
              isTag
              needBox={showCheckbox}
              selectedChapters={selectedChapters}
              setSelectedChapters={setSelectedChapters}
              isSelected={isSelected}
              dispatch={dispatch}
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
                    dispatch={dispatch}
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
    </div>
  );
}

export default connect(({ epub: { navId, view, currChIndex, epub: { chapters } } }) => ({
  navId, chapters, view, currChIndex
}))(NavigationMenu);
