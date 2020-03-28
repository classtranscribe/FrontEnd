import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { ClassTranscribeFooter } from '../../../../components'
import WatchHistory from './WatchHistory'
import './index.css'
import { util } from '../../../../utils'

export function History({ state, removeWatchHistory }) {
  useEffect(() => {
    util.scrollToTop('.sp-content')
    util.links.title('History')
  }, [])
  
  return (
    <div className="history-bg ct-a-fade-in">
      <h1 className="accessbility_hide">History</h1>
      <div className="goback-container">
        <Link className="del-icon" to={util.links.home()}>
          <Icon name="chevron left" /> Back to Courses
        </Link>
      </div>
      <WatchHistory 
        {...state}
        removeWatchHistory={removeWatchHistory} 
      />
      <ClassTranscribeFooter />
    </div>
  )
}