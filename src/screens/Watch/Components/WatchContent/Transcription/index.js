import React, { useState, useEffect, lazy, Suspense } from 'react'
import $ from 'jquery'
import ToolBar from './ToolBar'
// import Captions from './Captions'
import './index.css'
const Captions = lazy(() => import('./Captions'))


export default function Transcription({ captions, setReadyToEdit, setCurrTime, reLoadCaption }) {
  const [expand, setExpand] = useState('')

  const handleExpand = () => {
    setExpand(expand => expand ? '' : 'trans-con-expand')
  }

  useEffect(() => {
    window.addEventListener('keydown', ({keyCode, metaKey, ctrlKey, shiftKey}) => {
      if (!metaKey && !ctrlKey) return;
      // console.log(keyCode)
      // cmd/ctrl + 'U' == expand transcription container
      if (keyCode === 85) handleExpand()
      // shift + cmd/ctrl + space == search captions
      if (shiftKey && keyCode === 32) { 
        let alreadyFocused = $('#caption-search:focus').length
        if (alreadyFocused) $('#caption-search').blur()
        else $('#caption-search').focus()
      }
    })
  }, [setReadyToEdit])

  return (
    <div className={`trans-container ${expand}`}>
      <ToolBar expand={expand} handleExpand={handleExpand} />
      <Suspense fallback={<div>Loading...</div>}>
        <Captions 
          captions={captions} 
          setCurrTime={setCurrTime}
          reLoadCaption={reLoadCaption}
          setReadyToEdit={setReadyToEdit} 
        />
      </Suspense>
    </div>
  )
}