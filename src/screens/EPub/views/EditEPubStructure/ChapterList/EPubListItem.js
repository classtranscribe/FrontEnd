import React, { useState } from 'react';
import cx from 'classnames';
import { Button } from 'pico-ui';
import { connect } from 'dva'
import { CTText, altEl } from 'layout';
import timestr from 'utils/use-time';
import { uurl } from 'utils/use-url';
import Image from 'components/Image';
import { epub } from '../../../controllers';
import { ChapterEditButton, MDEditorModal } from '../../../components';
import ChapterInfo from '../../EditEPubChapter/ChapterEditor/ChapterInfo';
import { ChapterImage, ChapterText } from '../../../components';

function EPubListItem({
  chapter,
  item,
  itemIndex,
  chapterIndex,
  subChapterIndex,
  isSubChapter = false,
  canSplit = false,
  canSplitSubChapter = false,
  canSubdivide = false,
  canAddImage = true,
  canAddText = true,
  setEPubItem,
  dispatch
}) {
    const chapterText = chapter.contents[1]
    const imgSrc = uurl.getMediaUrl(item.image);
    const SubCParams = { chapterIdx: chapterIndex, subChapterIdx: subChapterIndex, itemIdx: itemIndex };
    const CParams = { chapterIdx: chapterIndex, itemIdx: itemIndex };

    const [insertType, setInsertType] = useState(null);
  const openMDEditor = insertType === 'md';

  const onInsert = (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'insertChapterContent', payload: { contentIdx: CParams.chapterIdx, value: val }
      }
    })
  };

  const handleClose = () => setInsertType(null);

  const handleSave = (val) => {
    console.log(val, CParams.chapterIdx)
    if (typeof onInsert === 'function' && val) {
      onInsert(val);
    }
    handleClose();
  };



  const handleOpenMDEditor = () => setInsertType('md');


 const handleSaveImage = (val) => {
    //handleSave(new EPubImageData(val).toObject());
  };

 const handleOpenImgPicker = () => {
    const imgData = {
      screenshots: imgSrc,
      onSave: handleSaveImage,
      //chapterScreenshots: epub.chapters[subChapterIndex].allImagesWithIn
    };
    dispatch({ type: 'epub/setImgPickerData', payload: imgData });
  }

  // const onTextChange = (subChapterindex) => (val) => {
  //   dispatch({
  //     type: 'epub/updateEpubData', payload: {
  //       action: val ? 'setChapterContent' : 'removeChapterContent', payload: { contentIdx: subChapterindex, value: val }
  //     }
  //   })
  // };

  const onImageChange = (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'setChapterContent', payload: { contentIdx: CParams.itemIdx, value: val, type: 'image' }
      }
    })
  };

  const onRemove = () => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'removeChapterContent', payload: { contentIdx: CParams.itemIdx, type: 'image' }
      }
    })
  };

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

    const addImgElement = altEl(Button, canAddImage, {
      ...btnProps,
      text: 'Add Image',
      icon: 'image',
      onClick: handleOpenImgPicker
    });

    const addTextElement = altEl(Button, canAddText, {
      ...btnProps,
      text: 'Add Text',
      icon: 'add',
      onClick: handleOpenMDEditor
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
          {addImgElement}
          {addTextElement}
        </div>

        <MDEditorModal
          show={openMDEditor}
          onClose={handleClose}
          onSave={handleSave}
          title="Insert New Text"
        />

        {
          itemIndex == 0 ? (
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
                {/* <Image src={imgSrc} alt="screenshot" /> */}
                {<ChapterImage
                  id={item.id}
                  image={{src: item.image}}
                  enableChapterScreenshots
                  onChooseImage={onImageChange}
                  onRemoveImage={onRemove}
                />}

                {/* text below must be modified to make sure text length is greater than a certain amount */}
                <CTText line={4} className="item-text">
                  {
                    chapterText
                    ||
                    <span className="text-muted"><i>No Transcriptions</i></span>
                  }
                </CTText>
              </div>
            </div>
          ) : (<></>)
        }
      </div>
    );
}

export default connect()(EPubListItem); 