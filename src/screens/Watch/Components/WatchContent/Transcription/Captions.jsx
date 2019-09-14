import React from 'react'
import { handleExpand } from '../watchUtils'
import { CaptionLine, LineLoader } from './CaptionLine'

export default function Captions({ captions, results, setReadyToEdit, loadingCaptions, ...captionLineProps }) {
  if (loadingCaptions) return <LineLoader index={-1} />
  const lines = results.length ? results : captions
  return (
    <div 
      className="captions" 
      onMouseEnter={() => setReadyToEdit(true)} 
      onMouseLeave={() => setReadyToEdit(false)}
      id="captions"
    >
      {
        lines[0] === 'NOT FOUND' ? 
        <div className="h-100 d-flex justify-content-center text-muted">No Match</div>
        :
        lines[0] === 'NO CAPTIONS' ? 
        <div className="h-100 d-flex justify-content-center text-muted">No Captions</div>
        :
        lines.map( line => (
          <CaptionLine 
            line={line} 
            key={line.id} 
            handleExpand={handleExpand}
            setReadyToEdit={setReadyToEdit}
            {...captionLineProps}
          />
        ))
      }
    </div>
  )
}
