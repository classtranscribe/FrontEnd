import React, { useState, useEffect, lazy, Suspense } from 'react'
import $ from 'jquery'
import ToolBar from './ToolBar'
// import Captions from './Captions'
import './index.css'
const Captions = lazy(() => import('./Captions'))


export default function Transcription({ captions, setReadyToEdit, setCurrTime, reLoadCaption }) {
  const [expand, setExpand] = useState('')
  const [results, setResults] = useState([])

  const handleExpand = value => {
    if (value === undefined)
      setExpand(expand => expand ? '' : 'trans-con-expand')
    else 
      setExpand(() => value ? 'trans-con-expand' : '')
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
      <ToolBar 
        expand={expand} 
        captions={captions}
        setResults={setResults}
        handleExpand={handleExpand} 
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Captions 
          results={results}
          captions={captions} 
          setCurrTime={setCurrTime}
          handleExpand={handleExpand}
          reLoadCaption={reLoadCaption}
          setReadyToEdit={setReadyToEdit} 
        />
      </Suspense>
    </div>
  )
}