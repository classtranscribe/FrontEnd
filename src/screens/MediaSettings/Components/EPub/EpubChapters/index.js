import React from 'react'
import _ from 'lodash'
import { connectWithRedux } from '../../../Utils'
import EpubList from './EpubList'
import EpubHeader from '../EpubHeader'
import './index.scss'

function EpubChaptersWithRedux({
  chapters=[],
  splitChapter,
  undoSplitChapter,
  changeChapter,
  language,
  changeLanguage,
  handleTitleChange,
  magnifyImage,
  endMagnifyImage,
  magnifiedImg,
  foldedIds,
  foldChapter,
  unfoldChapter,
  isEditingEpub=false,
}) {

  // console.log('chapters', chapters)

  return (
    <div className="msp-ee-el-con ct-d-c ct-a-fade-in" data-editing={isEditingEpub}>
      <EpubHeader title="Manage Your ePub Book" language={language} changeLanguage={changeLanguage}>
        <EpubHeader.Text>
          <EpubHeader.Subtitle className="msp-ee-el-h-p-t" text="Instruction" />
          To manage your ePub chapters, set <span>splitting points</span> between screenshots to generate an initial version of ePub chapters. 
          To change <span>cover images</span>, click the image of the ePub preview on the left.
          <br/>
          After everything is done, hit <span>'Save ePub' button</span> to see the preview of your ePub file. You can also edit the ePub contents there.
        </EpubHeader.Text>
      </EpubHeader>

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
          {/* <Button round icon="close" /> */}
        </div>
      }
    </div>
  )
}

export default connectWithRedux(
  EpubChaptersWithRedux,
  ['isEditingEpub'],
  []
)
