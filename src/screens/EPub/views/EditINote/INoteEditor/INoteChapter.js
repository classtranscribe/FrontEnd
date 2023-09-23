import { CTFragment, CTText, altEl} from 'layout'
import React, {useState} from 'react' 
import { Button } from 'pico-ui';
import { EPubImageData } from 'entities/EPubs';
import { ChapterImage, ChapterText, ChapterTitle, MDEditorModal } from '../../../components';
import {epub as epubTools} from '../../../controllers'


function INoteChapter ({
  chapter, 
  chIdx,
  canSplitSubChapter = true,
  canSubdivide = true,
  isSubChapter,
  subChIdx,
  dispatch 
}) {
  const [insertType, setInsertType] = useState(null);
  const openMDEditor = insertType === 'md';
  const [openModalIndex, setOpenModalIndex] = useState(null);

  const handleOpenMDEditor = (itemIdx) => {
    setInsertType('md');
    setOpenModalIndex(itemIdx)
  };
      
  const handleClose = () => {
    setInsertType(null);
    setOpenModalIndex(openModalIndex);
  }

  const onInsert = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'insertChapterContentAtChapterIdx', payload: { contentIdx: index, chapterIdx: chIdx, value: val }
      }
    })
  };

  const handleSave = (val) => {
    if (typeof onInsert === 'function' && val) {
      onInsert(openModalIndex)(val);
    }
    handleClose();
  };
    
   
  const handleSaveImage = (itemIdx) => (val) => {
    let imageval = new EPubImageData(val).toObject();
    if (typeof onInsert === 'function' && imageval) {
      onInsert(itemIdx)(imageval);
    }
  };

  const handleOpenImgPicker = (itemIdx) => {
    const imgData = {
      onSave: handleSaveImage(itemIdx),
    };
    dispatch({ type: 'epub/setImgPickerData', payload: imgData });
  }

  // Buttons and onClick Functions 
  const btnProps = {
    round: true,
    uppercase: true,
    classNames: 'item-action-btn',
    color: 'teal transparent'
  };

  // Split and Merge Chapter Button and Functions
  const sliceChapter = (itemIdx) => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'sliceChapter', payload: { chapterIdx: chIdx, itemIdx }
    }
  });

  // Undo Chapter Split 
  const mergeChapter = () => dispatch({
    type: 'epub/updateEpubData', payload: {
      action: 'mergeChapter', payload: { chapterIdx: chIdx }
    }
  })

  const splitBtnElement = (itemIdx) => {
    let canSplit = itemIdx > 0
    return altEl(Button, canSplit, {
      ...btnProps,
      text: 'Split Chapter',
      icon: 'unfold_more',
      onClick: () => sliceChapter(itemIdx)
  })};

  const mergeChapterBtnElement = (itemIdx) => {
    let canMerge = chIdx > 0 && itemIdx === 0;
    return altEl(Button, canMerge, {
      ...btnProps,
      text: 'Merge Chapter With Above',
      icon: 'unfold_less',
      onClick: mergeChapter
  })};

  // Add Image Button
  const addImgElement = (itemIdx) => {
    return altEl(Button, true, {
      ...btnProps,
      text: 'Add Image',
      icon: 'image',
      onClick: () => handleOpenImgPicker(itemIdx)
  })};

  // Add Text Button 
  function addTextElement(itemIdx) {
    return altEl(Button, true, {
      ...btnProps,
      text: 'Add Text',
      icon: 'add',
      onClick: () => handleOpenMDEditor(itemIdx)
  })};

  // New Subchapter Button 
  const splitSChBtnElement = (itemIdx) => {
    return altEl(Button, canSplitSubChapter, {
      ...btnProps,
      text: 'New Sub-Chapter',
      icon: 'subdirectory_arrow_right',
      // onClick: splitSubChapter
  })};

  // Subdivide Button 
  const subdivideBtnElement = (itemIdx) => {
    return altEl(Button, canSubdivide, {
      ...btnProps,
      text: 'subdivide',
      icon: 'subdirectory_arrow_right',
      // onClick: subdivideChapter
  })};

  // DISPATCH FUNCTIONS 
  // Save Chapter Title Handler 
  const saveChapterTitle = (value) =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveChapterTitle', payload: { chapterIdx: chIdx, value }
    }
  })

  // Chapter Image Functions
  const onImageChange = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'setChapterContentAtChapterIdx', payload: { chapterIdx: chIdx, contentIdx: index, value: val, type: 'image' }
      }
    })
  };

  const onTextChange = (index) => (val) => {  
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: val ? 'setChapterContentAtChapterIdx' : 'removeChapterContentAtChapterIdx', payload: { chapterIdx: chIdx, contentIdx: index, value: val }
      }
    })
  };

  const onRemove = (index) => () => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'removeChapterContent', payload: { contentIdx: index, type: 'image' }
      }
    })
  };

  return (
    <CTFragment dFlexCol>
      <CTFragment 
        id={epubTools.id.chID(chapter.id)}
        className='ct-inote-chapter'
      >
        <CTFragment className='chapter-title'>
          <CTText muted className="pt-2 pl-2">Chapter {chIdx + 1}: {chapter.title}</CTText>
          <CTFragment className="ch-item-title-con ct-d-r-center-v">
            <ChapterTitle
              id={epubTools.id.chTitleID(chapter.id)}
              value={chapter.title}
              onSave={saveChapterTitle}
              headingType="h2"
              className="ch-item-title"
            />
          </CTFragment>
        </CTFragment>

        {chapter.contents.map((content, itemIdx) => (
          <CTFragment key={itemIdx}>
            <CTFragment className="item-actions">
              {mergeChapterBtnElement(itemIdx)}
              {splitBtnElement(itemIdx)}
              {/* {splitSChBtnElement(itemIdx)} */}
              {/* {subdivideBtnElement(itemIdx)} */}
              {addImgElement(itemIdx)}
              {addTextElement(itemIdx)}
            </CTFragment>

          {typeof content === "object" ? ( // image
            <CTFragment className='img-con'>   
              <ChapterImage 
                id={`ch-content-${chapter.id}-${itemIdx}`}
                image={content} // TODO ITEM id and ocr and alttext maybe map between item and content 
                enableChapterScreenshots
                onChooseImage={onImageChange(itemIdx)}
                onRemoveImage={onRemove(itemIdx)}
              />
            </CTFragment> 
            ) : ( // text 
            <CTFragment className='item-text'>   
              <ChapterText  
                id={`ch-content-${chapter.id}-${itemIdx}`}
                text={content}
                onSaveText={onTextChange(itemIdx)}
              />
            </CTFragment>  
          )}  
          </CTFragment>
        ))}
      </CTFragment>

      {insertType !== null && (
        <MDEditorModal
          show={openMDEditor}
          onClose={handleClose}
          onSave={handleSave}
          title="Insert New Text"
        />
      )}     
    </CTFragment>
  )
}

export default INoteChapter