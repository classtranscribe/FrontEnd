import React from 'react'
import _ from 'lodash'
import { connectWithRedux } from '../../../Utils'
import EpubList from './EpubList'
import EpubHeader from './EpubHeader'
import './index.scss'

function EpubChaptersWithRedux({
  chapters=[],
  language,
  magnifiedImg,
  foldedIds,
  isEditingEpub=false,
}) {

  // console.log('chapters', chapters)

  return (
    <div data-scroll
      className="msp-ee-el-con ct-d-c ct-a-fade-in" 
      data-editing={isEditingEpub}
    >
      <EpubHeader language={language}/>

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubList 
            key={`ee-el-ch-${chapterIndex}`} 
            chapter={chapter}
            chapterIndex={chapterIndex}
            foldedIds={foldedIds}
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
