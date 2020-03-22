import React, { useEffect, useState } from 'react'

import EpubSidebar from './EpubSidebar'
import EpubContent from './EpubContent'
import EpubEditor from './EpubEditor'

import { connectWithRedux, epub } from '../../Utils'
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
      {
        isSettingEpub 
        ?
        <>
          <EpubEditor />
        </>
        :
        <>
          <EpubSidebar 
            currChapter={currEpub}
            handleChapterClick={handleChapterClick}
          />

          <div className="msp-e-content">
            <EpubContent 
              currChapter={currEpub} 
              handleChapterClick={handleChapterClick}
            />
          </div>
        </>
      }
    </div>
  )
}

export const EPub = connectWithRedux(
  EPubWithRedux,
  ['media', 'isSettingEpub'],
  []
)