import React from 'react'
import { Tab } from 'react-bootstrap'
import { Button as UIButton } from 'semantic-ui-react'

function EmptyResult(props) {
  return (
    <Tab.Pane eventKey="noPlaylists" className="empty-result">
      <div className="welcome">
        <div>
          <h2>WELCOME TO</h2>
          <h1>CLASS TRANSCRIBE</h1>
        </div>
        <UIButton 
          onClick={props.newPlaylist} 
          style={{width: 'max-content', marginTop: '1rem'}} 
          size='big' secondary
        >
          Create Your First Playlist in {props.course.num}
        </UIButton>
      </div>
    </Tab.Pane>
  )
}

export default EmptyResult;