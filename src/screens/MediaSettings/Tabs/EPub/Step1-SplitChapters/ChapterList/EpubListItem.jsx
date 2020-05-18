import React from 'react';
import { Button } from 'pico-ui';
import { epub } from 'screens/MediaSettings/Utils/epub';

const classNames = require('classnames');

export default function EpubListItem({
  item,
  itemIndex,
  chapterIndex,
  subChapterIndex,
  isSubChapter=false,
  canSplit=false,
  canSplitSubChapter=false,
  canSubdivide=false,
}) {

  const imgSrc = epub.getImageUrl(item.image);

  const splitChapterFromSubChaptersItems = () => {
    epub.splitChapterFromSubChaptersItems(chapterIndex, subChapterIndex, itemIndex);
  };

  const splitChapterFromChaptersItems = () => {
    epub.splitChapterFromChaptersItems(chapterIndex, itemIndex);
  };

  const handleSplitChapter = isSubChapter 
                            ? splitChapterFromSubChaptersItems
                            : splitChapterFromChaptersItems;

  const splitSubChapter = () => {
    epub.splitSubChapter(chapterIndex, subChapterIndex, itemIndex);
  };

  const subdivideChapter = () => {
    epub.subdivideChapter(chapterIndex, itemIndex);
  };

  const magnifyImage = () => epub.magnifyImage(imgSrc);
  const endMagnifyImage = () => epub.endMagnifyImage();


  let itemClass = classNames('ee-sch-item ct-d-c', {
    'padded': !canSplit && !isSubChapter
  });


  return (
    <div className={itemClass}>
      <div className="ee-sch-i-actions">
        {
          canSplit
          &&
          <Button uppercase round
            classNames="ee-sch-i-split-btn"
            text="Split Chapter"
            color="blue transparent"
            icon="unfold_more"
            onClick={handleSplitChapter}
          />
        }

        {
          canSplitSubChapter
          &&
          <Button uppercase round
            classNames="ee-sch-i-split-btn"
            text="New Sub-Chapter"
            color="blue transparent"
            icon="subdirectory_arrow_right"
            onClick={splitSubChapter}
          />
        }

        {
          canSubdivide
          &&
          <Button uppercase round
            classNames="ee-sch-i-sub-ch-btn"
            text="subdivide"
            color="blue transparent"
            icon="subdirectory_arrow_right"
            onClick={subdivideChapter}
          />
        }
      </div>

      <div className="ct-d-r ee-sch-i-info">
        <div 
          className="ee-sch-i-img"
          tabIndex="0"
          // onMouseEnter={magnifyImage}
          // onMouseLeave={endMagnifyImage}
          onFocus={magnifyImage}
          onBlur={endMagnifyImage}
        >
          <img src={imgSrc} alt="screenshot" />
        </div>
        <div className="ee-sch-i-text">
          {
            item.text 
            ||
            <span className="text-muted"><i>No Transcriptions</i></span>
          }
        </div>
      </div>
    </div>
  );
}
