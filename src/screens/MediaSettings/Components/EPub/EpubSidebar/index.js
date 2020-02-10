import React from 'react'
import { connectWithRedux } from '_redux/media-settings'
import { MSPSidebar } from '../../MSPSidebar'
import ChaptersSidebar from './ChaptersSidebar'
import SettingSidebar from './SettingSidebar'

import './index.scss'

function Sidebar({
  isSettingEpub=false,
  currChapter,
  handleChapterClick,
}) {
  
  return (
    <MSPSidebar id="msp-epub-sidebar">
      {
        isSettingEpub
        ?
        <SettingSidebar
          currChapter={currChapter}
        />
        :
        <ChaptersSidebar 
          currChapter={currChapter} 
          handleChapterClick={handleChapterClick}
        />
      }
    </MSPSidebar>
  )
}

export default connectWithRedux(
  Sidebar,
  ['isSettingEpub'],
  []
)