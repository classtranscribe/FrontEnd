import React from 'react'
import ToolBar from './ToolBar'
import Captions from './Captions'
import './index.css'


export default function Transcription({ captions, setReadyToEdit }) {
  return (
    <div className="trans-container">
      <ToolBar />
      <Captions captions={captions} setReadyToEdit={setReadyToEdit} />
    </div>
  )
}