import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/media-settings'
import Sidebar from './Sidebar'
import { epub } from '../../Utils'

function EPubWithRedux({
  media
}) {

  const [currEpubIdx, setCurrEpubIdx] = useState(0)

  useEffect(() => {
    if (media.id) {
      epub.setupEpub(media.id)
    }
  }, [media])

  return (
    <div className="msp-epub-con ct-a-fade-in">
      <Sidebar />
    </div>
  )
}

export const EPub = connectWithRedux(
  EPubWithRedux,
  ['media'],
  []
)