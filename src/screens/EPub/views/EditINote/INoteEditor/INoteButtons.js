import React from 'react';
import cx from 'classnames';
import { Button } from 'pico-ui';
import { connect } from 'dva'
import { CTText, altEl } from 'layout';
import timestr from 'utils/use-time';
import { uurl } from 'utils/use-url';
import Image from 'components/Image';
import { epub } from '../../../controllers';

function INoteButtons({
  item,
  itemIdx,
  chIdx,
  subChapterIdx,
  isSubChapter = false,
  canSplit = false,
  canSplitSubChapter = false,
  setEPubItem,
  dispatch
}) {
    const imgSrc = uurl.getMediaUrl(item.image);

    const splitChapterFromSubChaptersItems = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitChapterFromSubChaptersItems', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx, itemIdx: itemIdx }
      }
    });

    const splitChapterFromChaptersItems = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitChapterFromChaptersItems', payload: { chapterIdx: chIdx, itemIdx: itemIdx }
      }
    });

    const handleSplitChapter = isSubChapter
      ? splitChapterFromSubChaptersItems
      : splitChapterFromChaptersItems;

    const splitSubChapter = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitSubChapter', payload: { chapterIdx: chIdx, subChapterIdx: subChapterIdx, itemIdx: itemIdx }
      }
    });

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

    return (
      <div role="listitem" className={itemClass}>
        <div className="item-actions">
          {splitBtnElement}
          {splitSChBtnElement}
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
          <Image src={imgSrc} alt="screenshot" />
          <CTText line={4} className="item-text">
            { item.text || <span className="text-muted"><i>No Transcriptions</i></span> }
          </CTText>
        </div>
      </div>
    </div>
  );
}
export default connect()(INoteButtons); 