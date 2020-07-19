import React from 'react';
import cx from 'classnames';
import { Button } from 'pico-ui';
import { CTText } from 'layout';
import { uurl } from 'utils/use-url';
import { epub } from '../../controllers';

function EPubListItem({
  item,
  itemIndex,
  chapterIndex,
  subChapterIndex,
  isSubChapter = false,
  canSplit = false,
  canSplitSubChapter = false,
  canSubdivide = false,
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
  const openCarousel = () => epub.ctrl.openEPubItemCarousel(item.id);


  let itemClass = cx('ct-epb', 'sch', 'epb-data-item', 'ct-d-c', {
    sub: isSubChapter,
    'padded-actions': !canSplit && !isSubChapter,
  });

  return (
    <div role="listitem" className={itemClass}>
      <div className="item-actions">
        {
          canSplit
          &&
          <Button
            uppercase
            round
            classNames="item-action-btn"
            text="Split Chapter"
            color="teal transparent"
            icon="unfold_more"
            onClick={handleSplitChapter}
          />
        }

        {
          canSplitSubChapter
          &&
          <Button
            uppercase
            round
            classNames="item-action-btn"
            text="New Sub-Chapter"
            color="teal transparent"
            icon="subdirectory_arrow_right"
            onClick={splitSubChapter}
          />
        }

        {
          canSubdivide
          &&
          <Button
            uppercase
            round
            classNames="item-action-btn"
            text="subdivide"
            color="teal transparent"
            icon="subdirectory_arrow_right"
            onClick={subdivideChapter}
          />
        }
      </div>

      <div 
        id={item.id}
        role="button" 
        tabIndex="0" 
        className="ct-d-r item-info"
        onClick={openCarousel}
      >
        <div 
          className="item-img-con"
          // tabIndex="0"
          // onMouseEnter={magnifyImage}
          // onMouseLeave={endMagnifyImage}
          // onFocus={magnifyImage}
          // onBlur={endMagnifyImage}
        >
          <img src={imgSrc} alt="screenshot" />
        </div>
        <CTText line={5} className="item-text">
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