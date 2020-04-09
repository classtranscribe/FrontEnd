import React, { useEffect } from 'react'
import { ClassTranscribeFooter } from 'components'
import WatchHistory from './WatchHistory'
import './index.css'
import { util } from 'utils'

export function History({ state, removeWatchHistory }) {
  useEffect(() => {
    util.scrollToTop('.sp-content')
    util.links.title('History')
  }, [])
  
  return (
    <div className="history-bg ct-a-fade-in">
      <WatchHistory 
        {...state}
        removeWatchHistory={removeWatchHistory} 
      />
      <ClassTranscribeFooter />
    </div>
  )
}