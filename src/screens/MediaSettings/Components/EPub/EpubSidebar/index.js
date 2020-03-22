import React from 'react'
import { connectWithRedux } from '../../../Utils'
import { MSPSidebar } from '../../MSPSidebar'
import ChaptersSidebar from './ChaptersSidebar'
// import SettingSidebar from './SettingSidebar'

import './index.scss'

function Sidebar({
  currChapter,
  handleChapterClick,
}) {
  
  return (
    <MSPSidebar id="msp-epub-sidebar">
      <ChaptersSidebar 
        currChapter={currChapter} 
        handleChapterClick={handleChapterClick}
      />
    </MSPSidebar>
  )
}

export default connectWithRedux(
  Sidebar,
  [],
  []
)