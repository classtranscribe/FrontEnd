import { CTFragment, CTText, altEl} from 'layout'
import React from 'react' 
import { Button } from 'pico-ui';
import { ChapterImage, ChapterText, ChapterTitle } from '../../../components';
import {epub as epubTools} from '../../../controllers'

function INoteChapter ({
    chapter, 
    chIdx,
    canSplit = true,
    canSplitSubChapter = true,
    canSubdivide = true,
    dispatch 
}) {
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
            // onClick: handleSplitChapter(i1)
    })};

    // Add Image Button
    const addImgElement = (itemIdx) => {
        return altEl(Button, true, {
            ...btnProps,
            text: 'Add Image',
            icon: 'image',
            // onClick: handleOpenImgPicker
    })};

    // Add Text Button 
    const addTextElement = (itemIdx) => {
        return altEl(Button, true, {
            ...btnProps,
            text: 'Add Text',
            icon: 'add',
            // onClick: handleOpenMDEditor
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

            {chapter.contents.map((content, itemIdx) => ( // TODO pass on itemidx to itemactions
                <div key={itemIdx}>
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
                              image={content} // TODO ITEM id and ocr and alttext maybe map between item and content 
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
    )
}

export default INoteChapter