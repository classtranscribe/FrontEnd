/**
 * The component for Instructor Offering Page
 * will show when there is no playlists yet
 */
import React from 'react'
import { Tab } from 'react-bootstrap'
import { Button } from 'semantic-ui-react'
import { GeneralLoader } from 'components'
import { util } from 'utils'

export function EmptyResult({id, state: { playlistLoaded }}) {
  if (!playlistLoaded) 
    return <GeneralLoader loading height='100%' inverted/>
  return (
    <Tab.Pane eventKey="noPlaylists" className="empty-result">
      <div className="welcome">
        <div>
          <h2>WELCOME TO</h2>
          <h1>CLASS TRANSCRIBE</h1>
        </div>
        <Button 
          onClick={()=>util.links.newPlaylist(id)} 
          style={{width: 'max-content', marginTop: '1rem'}} 
          size='big' secondary
          content="Create Your First Playlist"
          aria-label="create a new playlist"
        />
      </div>
    </Tab.Pane>
  )
}
