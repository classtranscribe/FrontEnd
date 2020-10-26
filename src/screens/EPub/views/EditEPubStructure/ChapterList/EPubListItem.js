import React from 'react';
import cx from 'classnames';
import { Button } from 'pico-ui';
import { CTText, altEl } from 'layout';
import timestr from 'utils/use-time';
import { uurl } from 'utils/use-url';
import { epub } from '../../../controllers';

function EPubListItem({
  item,
  itemIndex,
  chapterIndex,
  subChapterIndex,
  isSubChapter = false,
  canSplit = false,
  canSplitSubChapter = false,
  canSubdivide = false,
  setEPubItem
}) {
  const imgSrc = uurl.getMediaUrl(item.image);

  const splitChapterFromSubChaptersItems = () => 
    epub.data.splitChapterFromSubChaptersItems(chapterIndex, subChapterIndex, itemIndex);

  const splitChapterFromChaptersItems = () => 
    epub.data.splitChapterFromChaptersItems(chapterIndex, itemIndex);

  const handleSplitChapter = isSubChapter 
                            ? splitChapterFromSubChaptersItems
                            : splitChapterFromChaptersItems;

  const splitSubChapter = () => 
    epub.data.splitSubChapter(chapterIndex, subChapterIndex, itemIndex);

  const subdivideChapter = () => epub.data.subdivideChapter(chapterIndex, itemIndex);

  // const magnifyImage = () => epub.ctrl.magnifyImage(imgSrc);
  // const endMagnifyImage = () => epub.ctrl.endMagnifyImage();
  const openItemDetails = () => setEPubItem(item);


  const itemClass = cx('ct-epb', 'sch', 'epb-data-item', 'ct-d-c', {
    sub: isSubChapter,
    'padded-actions': !canSplit && !isSubChapter,
  });

  const btnProps = {
    round: true,
    uppercase: true,
    classNames: 'item-action-btn',
    color: 'teal transparent'
  };

  const splitBtnElement = altEl(Button, canSplit, {
    ...btnProps,
    text: 'Split Chapter',
    icon: 'unfold_more',
    onClick: handleSplitChapter
  });

  const splitSChBtnElement = altEl(Button, canSplitSubChapter, {
    ...btnProps,
    text: 'New Sub-Chapter',
    icon: 'subdirectory_arrow_right',
    onClick: splitSubChapter
  });

  const subdivideBtnElement = altEl(Button, canSubdivide, {
    ...btnProps,
    text: 'subdivide',
    icon: 'subdirectory_arrow_right',
    onClick: subdivideChapter
  });

  return (
    <div role="listitem" className={itemClass}>
      <div className="item-actions">
        {splitBtnElement}
        {splitSChBtnElement}
        {subdivideBtnElement}
      </div>

      <div 
        id={item.id}
        role="button" 
        tabIndex="0" 
        className="ct-epb ct-d-r item-info"
        onClick={openItemDetails}
        aria-haspopup="true"
        aria-controls={epub.id.epbItemViewId(item.id)}
      >
        <div className="item-time-con">
          <div className="item-time">
            {timestr.toPrettierTimeString(item.start)}
          </div>
          <div className="item-time">
            {timestr.toPrettierTimeString(item.end)}
          </div>
        </div>
        
        <div className="item-img-con">
          <img src={imgSrc} alt="screenshot" />
        </div>
        <CTText line={4} className="item-text">
          {
            item.text 
            ||
            <span className="text-muted"><i>No Transcriptions</i></span>
          }
        </CTText>
      </div>
    </div>
  );
}

export default EPubListItem;