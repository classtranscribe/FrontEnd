import { CTFragment, CTText, altEl} from 'layout'
import React from 'react' 
import { ChapterImage, ChapterText, Text } from '../../../components';
import { Button } from 'pico-ui';

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
        // onClick: handleOpenImgPicker
    });

    // Add Text Button 
    const addTextElement = altEl(Button, true, {
        ...btnProps,
        text: 'Add Text',
        icon: 'add',
        // onClick: handleOpenMDEditor
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

    return (
        <div className='ct-inote-chapter'>
            <div className='title'>
                <CTText size='huge' bold>
                    {chapter.title}
                </CTText>
            </div>

            <div className="item-actions">
                {splitBtnElement}
                {splitSChBtnElement}
                {subdivideBtnElement}
                {addImgElement}
                {addTextElement}
            </div>

            {chapter.contents.map((content, idx) => (
                typeof content === "object" ? // image
                    <div className='img-con'>   
                        {<ChapterImage 
                            image={content} //TODO ITEM id and ocr and alttext maybe map between item and content 
                        />}
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