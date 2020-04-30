import React from 'react'
import _ from 'lodash'
import { connectWithRedux } from '../../../Utils'
import EpubChapterItem from './EpubChapterItem'
import EpubHeader from './EpubHeader'
import './index.scss'

function EpubChaptersWithRedux({
  chapters=[],
  language,
  magnifiedImg,
  foldedIds,

  epubData,
  isEditingEpub=false,
}) {

  // console.log('chapters', chapters)

  return (
    <div data-scroll
      className="msp-ee-el-con ct-d-c ct-a-fade-in" 
      data-editing={isEditingEpub}
    >
      <EpubHeader
        epubData={epubData}
        chapters={chapters}
        language={language}
      />

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubChapterItem 
            key={`ee-el-ch-${chapterIndex}`} 
            chapter={chapter}
            chapterIndex={chapterIndex}
            foldedIds={foldedIds}
            canUndoSplit={chapterIndex > 0}
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
  ['isEditingEpub', 'epubData'],
  []
)
