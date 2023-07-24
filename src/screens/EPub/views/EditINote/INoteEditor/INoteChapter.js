import { CTFragment, CTText, altEl} from 'layout'
import React, {useState} from 'react' 
import { Button } from 'pico-ui';
import { ChapterImage, ChapterText, ChapterTitle, MDEditorModal } from '../../../components';
import {epub as epubTools} from '../../../controllers'
import { EPubImageData } from 'entities/EPubs';

function INoteChapter ({
    chapter, 
    chIdx,
    canSplit = true,
    canSplitSubChapter = true,
    canSubdivide = true,
    canAddImage = true,
    canAddText = true,
    dispatch 
}) {
    
    const CParams = { chapterIdx: chIdx};

    const [insertType, setInsertType] = useState(null);
    const openMDEditor = insertType === 'md';

    const onInsert = (val) => {
        console.log(CParams.chapterIdx)
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'insertChapterContent', payload: { contentIdx: CParams.chapterIdx, value: val }
      }
    })
  };

    const handleOpenMDEditor = () => setInsertType('md');

    const handleClose = () => setInsertType(null);

    const handleSave = (val) => {
        console.log(val, CParams.chapterIdx)
        if (typeof onInsert === 'function' && val) {
            onInsert(val);
        }
        handleClose();
    };

    const handleSaveImage = (val) => {
        handleSave(new EPubImageData(val).toObject());
    };

    const handleOpenImgPicker = () => {
        const imgData = {
        //screenshots: imgSrc,
        onSave: handleSaveImage,
        //chapterScreenshots: epub.chapters[subChapterIndex].allImagesWithIn
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

    // Split Button 
    const splitBtnElement = altEl(Button, canSplit, {
        ...btnProps,
        text: 'Split Chapter',
        icon: 'unfold_more',
        // onClick: handleSplitChapter
    });

    // Add Image Button
    const addImgElement = altEl(Button, true, {
        ...btnProps,
        text: 'Add Image',
        icon: 'image',
        onClick: handleOpenImgPicker
    });

    // Add Text Button 
    const addTextElement = altEl(Button, true, {
        ...btnProps,
        text: 'Add Text',
        icon: 'add',
        onClick: handleOpenMDEditor
    });

    // New Subchapter Button 
    const splitSChBtnElement = altEl(Button, canSplitSubChapter, {
        ...btnProps,
        text: 'New Sub-Chapter',
        icon: 'subdirectory_arrow_right',
        // onClick: splitSubChapter
    });

    // Subdivide Button 
    const subdivideBtnElement = altEl(Button, canSubdivide, {
        ...btnProps,
        text: 'subdivide',
        icon: 'subdirectory_arrow_right',
        // onClick: subdivideChapter
    });

    // Save Chapter Title Handler 
    const saveChapterTitle = value =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveChapterTitle', payload: { chapterIdx: chIdx, value }
      }
    })

    return (
        <div 
          className='ct-inote-chapter' 
          id={epubTools.id.chID(chapter.id)}
        >
            <div className='chapter-title'>
                <CTText muted className="pt-2 pl-2">Chapter {chIdx + 1}: {chapter.title}</CTText>
                <div className="ch-item-title-con ct-d-r-center-v">
                    <ChapterTitle
                      id={epubTools.id.chTitleID(chapter.id)}
                      value={chapter.title}
                      onSave={saveChapterTitle}
                      headingType="h2"
                      className="ch-item-title"
                    />
                </div>
            </div>

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

            {chapter.contents.map((content, idx) => (
                typeof content === "object" ? // image
                    <div className='img-con'>   
                        <ChapterImage 
                          image={content} // TODO ITEM id and ocr and alttext maybe map between item and content 
                        />
                    </div>
                : // text 
                    <div className='item-text'>   
                        <ChapterText  
                          text={content}
                        />
                    </div>
            ))} 
        </div>
    )
}

export default INoteChapter