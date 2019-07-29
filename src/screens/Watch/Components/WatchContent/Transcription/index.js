import React, { useState, useEffect, lazy, Suspense } from 'react'
import $ from 'jquery'
import ToolBar from './ToolBar'
// import Captions from './Captions'
import './index.css'
const Captions = lazy(() => import('./Captions'))
const EXPAND_CLASS = 'trans-con-expand'

export default function Transcription({ captions, setReadyToEdit, setCurrTime, reLoadCaption }) {
  const [results, setResults] = useState([])

  const switchTrigger = html => {
    document.getElementById('expand-trigger').innerHTML = html
  }

  const handleExpand = value => {
    const isExpanded = $(`.${EXPAND_CLASS}`).length
    
    if (typeof value === 'boolean') {
      if (value) {
        $('.trans-container').addClass(EXPAND_CLASS)
        switchTrigger('expand_more')
      } else {
        $('.trans-container').removeClass(EXPAND_CLASS)
        switchTrigger('expand_less')
      }
    } else {
      if (isExpanded) {
        $('.trans-container').removeClass(EXPAND_CLASS)
        switchTrigger('expand_less')
      } else {
        $('.trans-container').addClass(EXPAND_CLASS)
        switchTrigger('expand_more')
      }
    } 
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
    <div className="trans-container">
      <ToolBar 
        captions={captions}
        setResults={setResults}
        canReset={results.length > 0}
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