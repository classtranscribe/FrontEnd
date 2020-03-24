import React from 'react'
import EpubList from './EpubList'
import { Button } from 'pico-ui'

export default function EpubChapters({
  chapters=[],
  splitChapter,
  undoSplitChapter,
  changeChapter,
  handleTitleChange,
  magnifyImage,
  endMagnifyImage,
  magnifiedImg,
  foldedIds,
  foldChapter,
  unfoldChapter
}) {

  return (
    <div className="msp-ee-el-con ct-d-c">
      <div className="msp-ee-el-header">
        <h1>Manage Your ePub Book</h1>
        <p>
          <span className="msp-ee-el-h-p-t">Instruction</span>
          To manage your ePub chapters, set <span>splitting points</span> between screenshots to generate an initial version of ePub chapters. 
          To change <span>cover images</span>, click the image of the ePub preview on the left.
          <br/>
          After everything is done, hit <span>'Save ePub' button</span> to see the preview of your ePub file. You can also edit the ePub contents there.
        </p>
      </div>

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubList 
            key={`ee-el-ch-${chapterIndex}`} 
            chapter={chapter}
            chapterIndex={chapterIndex}
            splitChapter={splitChapter}
            undoSplitChapter={undoSplitChapter}
            changeChapter={changeChapter}
            handleTitleChange={handleTitleChange}
            magnifyImage={magnifyImage}
            endMagnifyImage={endMagnifyImage}
            foldedIds={foldedIds}
            foldChapter={foldChapter}
            unfoldChapter={unfoldChapter}
          />
        ))}
      </div>

      {
        magnifiedImg
        &&
        <div className="ee-ep-magnify">
          <img src={magnifiedImg} alt="Magnified screenshot" />
          <Button round icon="close" />
        </div>
      }
    </div>
  )
}
