import React from 'react';
import cx from 'classnames';
import { Button } from 'pico-ui';
import { connect } from 'dva'
import { CTText, altEl } from 'layout';
import timestr from 'utils/use-time';
import { uurl } from 'utils/use-url';
import Image from 'components/Image';
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
  setEPubItem,
  dispatch
}) {
    const imgSrc = uurl.getMediaUrl(item.image);
    const SubCParams = { chapterIdx: chapterIndex, subChapterIdx: subChapterIndex, itemIdx: itemIndex };
    const CParams = { chapterIdx: chapterIndex, itemIdx: itemIndex };

    const splitChapterFromSubChaptersItems = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitChapterFromSubChaptersItems', payload: SubCParams
      }
    });

    const splitChapterFromChaptersItems = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitChapterFromChaptersItems', payload: CParams
      }
    });

    const handleSplitChapter = isSubChapter
      ? splitChapterFromSubChaptersItems
      : splitChapterFromChaptersItems;

    const splitSubChapter = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitSubChapter', payload: SubCParams
      }
    });

    const subdivideChapter = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'subdivideChapter', payload: CParams
      }
    });

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
            <Image src={imgSrc} alt="screenshot" />

            {/* text below must be modified to make sure text length is greater than a certain amount */}
            <CTText line={4} className="item-text">
              {
                item.text
                ||
                <span className="text-muted"><i>No Transcriptions</i></span>
              }
            </CTText>
          </div>
        </div>
      </div>
    );
}

export default connect()(EPubListItem); 