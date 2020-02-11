import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/media-settings'

import EpubSidebar from './EpubSidebar'
import EpubView from './EpubView'

import { epub } from '../../Utils'
import './index.scss'

function EPubWithRedux({
  media,
  isSettingEpub=false,
}) {

  const [currEpub, setCurrEpub] = useState({})
  const handleChapterClick = eb => () => {
    setCurrEpub(eb)
  }

  useEffect(() => {
    if (media.id) {
      epub.setupEpub(media.id)
    }
  }, [media])

  useEffect(() => {
    if (isSettingEpub) {
      handleChapterClick({})()
    }
  }, [isSettingEpub])

  useEffect(() => {
    return () => {
      epub.cancelResetEpub()
    }
  }, [])

  return (
    <div className="msp-epub-con ct-a-fade-in">
      <EpubSidebar 
        currChapter={currEpub}
        handleChapterClick={handleChapterClick}
      />

      <div className="msp-e-content">
        <EpubView 
          currChapter={currEpub} 
          handleChapterClick={handleChapterClick}
        />
      </div>
    </div>
  )
}

export const EPub = connectWithRedux(
  EPubWithRedux,
  ['media', 'isSettingEpub'],
  []
)