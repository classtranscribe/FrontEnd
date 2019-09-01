import React, { useState, lazy, Suspense } from 'react'
import ToolBar from './ToolBar'
// import Captions from './Captions'
import './index.css'
const Captions = lazy(() => import('./Captions'))

export default function Transcription(props) {
  const [results, setResults] = useState([])
  return (
    <div className="trans-container">
      <ToolBar 
        {...props}
        setResults={setResults}
        canReset={results.length > 0}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Captions 
          results={results}
          {...props}
        />
      </Suspense>
    </div>
  )
}