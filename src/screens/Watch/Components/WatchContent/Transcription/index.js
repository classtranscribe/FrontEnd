import React from 'react'
import ToolBar from './ToolBar'
import Captions from './Captions'
import './index.css'


export default function Transcription({ captions, setReadyToEdit, setCurrTime, reLoadCaption }) {
  return (
    <div className="trans-container">
      <ToolBar />
      <Captions 
        captions={captions} 
        setCurrTime={setCurrTime}
        reLoadCaption={reLoadCaption}
        setReadyToEdit={setReadyToEdit} 
      />
    </div>
  )
}