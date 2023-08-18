import { CTFragment, CTText, altEl} from 'layout'
import React, {useState} from 'react' 
import { Button } from 'pico-ui';
import { connect } from 'dva'
import { ChapterImage, ChapterText, ChapterTitle, MDEditorModal } from '../../../components';
import {epub as epubTools} from '../../../controllers'
import { indexOf } from 'lodash';
import { EPubImageData } from 'entities/EPubs';
import ChapterNewContent from '../../EditEPubChapter/ChapterEditor/ChapterNewContent';
import ChapterContent from '../../EditEPubChapter/ChapterEditor/ChapterContent';
import EPubSubChapterItem from '../../EditEPubStructure/ChapterList/EPubSubChapterItem';


function INoteChapter ({
    chapter, 
    chIdx,
    canSplit = false,
    canSplitSubChapter = false,
    canSubdivide = true,
    isSubChapter = false,
    itemIndex,
    subChapterIndex,
    dispatch, 

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

    const handleSave = (val) => {
        console.log(val, openModalIndex)
        if (typeof onInsert === 'function' && val) {
            onInsert(openModalIndex)(val);
        }
        handleClose();
    };
    
    const onInsert = (index) => (val) => {
        console.log(val, index);
        dispatch({
            type: 'epub/updateEpubData', payload: {
                action: 'insertChapterContentatChapterIdx', payload: { contentIdx: index, chapterIdx: chIdx, value: val }
            }
        })
    };

    const handleSaveImage = (val) => {
        handleSave(new EPubImageData(val).toObject());
    };

    const handleOpenImgPicker = (itemIdx) => {
        setOpenModalIndex(itemIdx)
        const imgData = {
        //screenshots: imgSrc,
        onSave: handleSaveImage,
        //chapterScreenshots: epub.chapters[subChapterIndex].allImagesWithIn
        };
        dispatch({ type: 'epub/setImgPickerData', payload: imgData });
    }


    const splitChapterFromSubChaptersItems = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitChapterFromSubChaptersItems', payload: {chapterIdx: chIdx, subChapterIdx: subChapterIndex, itemIdx: itemIndex }
      }
    });
    const splitChapterFromChaptersItems = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitChapterFromChaptersItems', payload: {chapterIdx: chIdx, itemIdx: itemIndex}
      }
    });
    const handleSplitChapter = isSubChapter
      ? splitChapterFromSubChaptersItems
      : splitChapterFromChaptersItems;
    const splitSubChapter = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'splitSubChapter', payload: {chapterIdx: chIdx, subChapterIdx: subChapterIndex, itemIdx: itemIndex }
      }
    });  
    const subdivideChapter = () => dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'subdivideChapter', payload: {chapterIdx: chIdx, itemIdx: itemIndex}
      }
    });


    // Buttons and onClick Functions 
    const btnProps = {
        round: true,
        uppercase: true,
        classNames: 'item-action-btn',
        color: 'teal transparent'
    };

    // Split Button 
    const splitBtnElement = (itemIdx) => {
        return altEl(Button, canSplit, {
            ...btnProps,
            text: 'Split Chapter',
            icon: 'unfold_more',
            // onClick: handleSplitChapter(itemIdx)
    })};

    // Add Image Button
    function addImgElement (itemIdx) {
        return altEl(Button, true, {
            ...btnProps,
            text: 'Add Image',
            icon: 'image',
            onClick: () => handleOpenImgPicker(itemIdx)
    })};
    // Add Text Button 
    function addTextElement(itemIdx) {
        // setOpenModalIndex(itemIdx);
        return altEl(Button, true, {
            ...btnProps,
            text: 'Add Text',
            icon: 'add',
            onClick: () => handleOpenMDEditor(itemIdx)
            // onClick: handleOpenMDEditor
    })};

    // // Split Button 
    // const splitBtnElement = (itemIdx) => {
    //     return altEl(Button, canSplit, {
    const splitBtnElement = altEl(Button, canSplit, {
      ...btnProps,
      text: 'Split Chapter',
      icon: 'unfold_more',
      onClick: handleSplitChapter
    });

    // // New Subchapter Button 
    // const splitSChBtnElement = (itemIdx) => {
    //     return altEl(Button, canSplitSubChapter, {
    const splitSChBtnElement = altEl(Button, canSplitSubChapter, {
      ...btnProps,
      text: 'New Sub-Chapter',
      icon: 'subdirectory_arrow_right',
      onClick: splitSubChapter
    });

    // // Subdivide Button 
    // const subdivideBtnElement = (itemIdx) => {
    //     return altEl(Button, canSubdivide, {
    const subdivideBtnElement = altEl(Button, canSubdivide, {
      ...btnProps,
      text: 'subdivide',
      icon: 'subdirectory_arrow_right',
      onClick: subdivideChapter
    });
    

    // Save Chapter Title Handler 
    const saveChapterTitle = value =>
        dispatch({
          type: 'epub/updateEpubData', payload: {
            action: 'saveChapterTitle', payload: { chapterIdx: chIdx, value }
        }
    })

    // Chapter Image Functions
    const onImageChange = (index) => (val) => {
        dispatch({
          type: 'epub/updateEpubData', payload: {
            action: 'setChapterContent', payload: { contentIdx: index, value: val, type: 'image' }
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
    
    // Change Text Functions
    const onTextChange = (index) => (val) => {
        dispatch({
          type: 'epub/updateEpubData', payload: {
            action: val ? 'setChapterContent' : 'removeChapterContent', payload: { contentIdx: index, value: val }
          }
        })
      };

    return (
        <div>
            <div 
            id={epubTools.id.chID(chapter.id)}
            className='ct-inote-chapter' 
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

                {chapter.contents.map((content, itemIdx) => (
                    <div className={itemIdx}>
                        <div className="item-actions">
                        {splitBtnElement(itemIdx)}
                        {splitSChBtnElement(itemIdx)}
                        {subdivideBtnElement(itemIdx)}
                        {addImgElement(itemIdx)}
                        {addTextElement(itemIdx)}
                        </div>

                        {typeof content === "object" ? ( // image
                            <div className='img-con'>   
                                <ChapterImage 
                                id={`ch-content-${chapter.id}-${itemIdx}`}
                                image={content} // TODO ITEM id and ocr and alttext maybe map between item and content 
                                enableChapterScreenshots
                                onChooseImage={onImageChange(itemIdx)}
                                onRemoveImage={onRemove(itemIdx)}
                                />
                            </div> 
                            ) : ( // text 
                            <div className='item-text'>   
                                <ChapterText  
                                text={content}
                                />
                            </div>  
                            
                        )}
                        
                    </div>
                ))}
            
            </div>
            {insertType !== null && (
                <MDEditorModal
                  show={openMDEditor}
                  onClose={handleClose}
                  onSave={handleSave}
                  title="Insert New Text"
                />
            )}     
        </div>
        
    )
}

export default connect() (INoteChapter)