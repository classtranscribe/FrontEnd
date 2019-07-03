/**
 * The component for Instructor Offering Page
 * will show when there is no playlists yet
 */
import React from 'react'
import { Tab } from 'react-bootstrap'
import { Button as UIButton } from 'semantic-ui-react'
import { util } from '../../../../util'

export function EmptyResult({id}) {
  return (
    <Tab.Pane eventKey="noPlaylists" className="empty-result" aria-label="Empty Result">
      <div className="welcome">
        <div>
          <h2>WELCOME TO</h2>
          <h1>CLASS TRANSCRIBE</h1>
        </div>
        <UIButton 
          onClick={()=>util.newPlaylist(id)} 
          style={{width: 'max-content', marginTop: '1rem'}} 
          size='big' secondary
        >
          Create Your First Playlist
        </UIButton>
      </div>
    </Tab.Pane>
  )
}
