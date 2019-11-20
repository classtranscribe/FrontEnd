import React, { useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import MenuRadio from '../MenuRadio'
import './index.css'
import { 
  transControl, 
  preferControl, 
  LINE_VIEW,
  TRANSCRIPT_VIEW
} from '../../../../Utils'

function TranscriptionSetting({
  transView=LINE_VIEW,
  openAD=false,
}) {

  const [autoScroll, setAutoScroll] = useState(preferControl.autoScroll())
  const [pauseWhileAD, setPauseWhileAD] = useState(preferControl.pauseWhileAD())
  const [pauseWhileEditing, setPauseWhileEditing] = useState(preferControl.pauseWhileEditing())

  const openTranscript = () => {

  }

  const openAutoScroll = ({ target: { checked } }) => {
    console.error()
    preferControl.autoScroll( !autoScroll )
    setAutoScroll( !autoScroll )
  }

  const handleAD = ({ target: { checked } }) => {
    transControl.handleOpenAD()
  }

  const handlePauseWhileAD = () => {
    preferControl.pauseWhileAD( !pauseWhileAD )
    setPauseWhileAD( !pauseWhileAD )
  }

  const handlePauseWhileEditing = () => {
    preferControl.pauseWhileEditing( !pauseWhileEditing )
    setPauseWhileEditing( !pauseWhileEditing )
  }

  const handleTransView = () => {
    transControl.transView(transView === LINE_VIEW ? TRANSCRIPT_VIEW : LINE_VIEW)
  }

  return (
    <form className="watch-menu-tab">
      <h2 className="watch-menu-tab-title">Transcriptions</h2>
      <div className="w-100">
        <MenuRadio 
          id="trans-open-radio"
          checked={true}
          label="Open Transcription" 
        />
        <MenuRadio 
          id="trans-auto-scroll-radio"
          label="Automatically scroll" 
          onChange={openAutoScroll}
          checked={autoScroll}
        />
        <MenuRadio 
          id="edit-pause-radio"
          label="Pause video while editing captions" 
          onChange={handlePauseWhileEditing}
          checked={pauseWhileEditing}
          description="Turn on to automatically pause video if you start to edit captions."
        />
      </div>
      <p className="watch-menu-tab-subtitle">Transcription Views</p>
      <div className="w-100">
        <MenuRadio 
          id="transcript-view-radio"
          label="Transcript View" 
          onChange={handleTransView}
          checked={transView === TRANSCRIPT_VIEW}
        />
        <MenuRadio 
          id="line-view-radio"
          label="Caption Line View" 
          onChange={handleTransView}
          checked={transView === LINE_VIEW}
          description="Only Caption Line View provides editable transcriptions."
        />
      </div>

      <h2 className="watch-menu-tab-title">Audio Description</h2>
      <div className="w-100">
        <MenuRadio 
          id="ad-open-radio"
          label="Open Audio Description" 
          onChange={handleAD}
          checked={openAD}
        />
        <MenuRadio 
          id="ad-pause-radio"
          label="Pause video when Audio Description starts" 
          onChange={handlePauseWhileAD}
          checked={pauseWhileAD}
          description="Turn on to automatically pause video when there is a audio description."
        />
      </div>
    </form>
  )
}

export default connectWithRedux(
  TranscriptionSetting,
  ['transView', 'openAD'],
  []
)