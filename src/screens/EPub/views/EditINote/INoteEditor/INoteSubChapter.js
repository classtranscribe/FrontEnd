import React, { useEffect } from 'react';
import cx from 'classnames';
import { CTText, altEl } from 'layout';
import { epub, getCompactText } from '../../../controllers';
import { ChapterTitle } from '../../../components';
import ChapterTitleButton from '../../EditEPubStructure/ChapterList/ChapterTitleButton';
import { uurl } from 'utils/use-url';
import Image from 'components/Image';
import { Button } from 'pico-ui';


function INoteSubChapter({
    subChapter,
    chIdx,
    subChapterIdx,
    
    canSplit = true,
    canSplitSubChapter = true,
    canSplitAsNewChapter = true,
    canUndoSubdivide = false,
    canUndoSplitSubChapter = false,

    //setEPubItem,
    dispatch
}) {

  const schClasses = cx('ct-epb', 'sch', 'ch-item', 'sub', 'ct-d-c');
  const imgSrc = (item) => uurl.getMediaUrl(item.image);
  const itemClass = cx('ct-epb', 'sch', 'epb-data-item', 'ct-d-c', {
    'padded-actions': !canSplit });

  const undoSubdivideChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'undoSubdivideChapter', payload: { chapterIdx: chIdx }
    }
  });

  const undoSplitSubChapter = () =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'undoSplitSubChapter', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx }
      }
    })

  const splitChapterFromSubChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'splitChapterFromSubChapter', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx }
    }
  })

  const saveSubChapterTitle = value =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveSubChapterTitle', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx, value }
      }
    })

  // Automatically update untitled subchapter names to correlate with subChapterIdx
  useEffect(() => {
    const reg = /^Untitled Sub-Chapter \(\d\)$/;
    if (reg.test(subChapter.title)) {
      saveSubChapterTitle(`Untitled Sub-Chapter (${subChapterIdx + 1})`)
    }
  }, [subChapterIdx]);

  const splitSubChapterintoNewChapter = (itemIdx) => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'splitChapterFromSubChaptersItems', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx, itemIdx: itemIdx }
    }
  });

  const splitSubChapters = (itemIdx) => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'splitSubChapter', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx, itemIdx: itemIdx }
    }
  });

  const btnProps = {
    round: true,
    uppercase: true,
    classNames: 'item-action-btn',
    color: 'teal transparent'
  };

//Split Into New Chapter
  const splitBtnElement = (itemIdx) => {
    return altEl(Button, canSplit, {
      ...btnProps,
      text: 'Split Into New Chapter',
      icon: 'unfold_more',
      onClick: () => splitSubChapterintoNewChapter(itemIdx)
  })};

// Split into new Sub-Chapter
  const splitSChBtnElement = (itemIdx) => {
    return altEl(Button, canSplitSubChapter, {
      ...btnProps,
      text: 'New Sub-Chapter',
      icon: 'subdirectory_arrow_right',
      onClick: () => splitSubChapters(itemIdx)
  })};


  return (
    <div id={epub.id.schID(subChapter.id)} className={schClasses}>
      <CTText muted className="pt-2 pl-2">
        Sub-Chapter {chIdx + 1}.{subChapterIdx + 1}: {subChapter.title}
      </CTText>
      <div
        className="ch-item-title-con sub ct-d-r-center-v"
      >
        <ChapterTitle
          id={epub.id.schTitleID(subChapter.id)}
          value={subChapter.title}
          headingType="h3"
          onSave={saveSubChapterTitle}
          className="ch-item-title"
        />

        <ChapterTitleButton
          show={canUndoSubdivide}
          content="Undo Subdivide"
          icon="chevron_left"
          className="ch-item-act-btn padded-2"
          onClick={undoSubdivideChapter}
        />

        <ChapterTitleButton
          show={canUndoSplitSubChapter}
          content="Append to Above Sub-Chapter"
          icon="vertical_align_top"
          className="ch-item-act-btn padded-2"
          onClick={undoSplitSubChapter}
        />

        <ChapterTitleButton
          show={canSplitAsNewChapter}
          content="As a new Chapter"
          icon="first_page"
          className="ch-item-act-btn padded-3"
          onClick={splitChapterFromSubChapter}
        />
      </div>

      <div className="ch-item-ol ct-d-c">
            {subChapter?.items?.map((item, itemIdx) => (
              <div role="listitem" className={itemClass}>
                <div className="item-actions">
                  {splitBtnElement(itemIdx)}
                  {splitSChBtnElement(itemIdx)}
                </div>
                <div
                  id={item.id}
                  role="button"
                  tabIndex="0"
                  className="ct-epb ct-d-r item-info"
                  //onClick={openItemDetails}
                  //aria-haspopup="true"
                  //aria-controls={epub.id.epbItemViewId(item.id)}
                >
                <div className="item-img-con">
                  {!itemIdx && ( <Image src={imgSrc(item)} alt="screenshot" /> )}
                    <CTText line={4} className="item-text">
                      {item.text || <span className="text-muted"><i>No Transcriptions</i></span>}
                    </CTText>
                  </div>
                </div>
              </div>
            ))}
        </div>
    </div>
  );
}

export default INoteSubChapter;
