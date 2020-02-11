import React, { useState } from 'react'
import { Grid } from 'semantic-ui-react'
import { CTForm } from 'components'
import { InfoIcon } from '../../InfoIcon'

import { plControl } from '../../../Utils'

const exampleYoutubeURL = "https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3"
const exampleEchoAccessLink = "https://echo360.org/section/59cc95a1-b088-46e3-80a3-7e3c6921a40f/public"
const exampleBoxURL = "https://uofi.app.box.com/folder/90057245222"
const exampleKalturaBUL = "https://mediaspace.illinois.edu/channel/CS+000+-+Fall+2019/123456789"

function PlaylistIdentifier({
  sourceType=2,
  setUrl,
}) {

  const [urlError, setUrlError] = useState(null)

  const setIndentifier = value => {
    setUrl(value)
    if (Boolean(value)) {
      if (plControl.isValidIdURL(sourceType, value)) {
        setUrlError(null)
      } else {
        setUrlError(
          `Please enter a valid ${
            sourceType === 0 ? 
            'Echo360 Access Link' : 
            sourceType === 1 ?
            'YouTube playlist URL' :
            sourceType === 3 ?
            'Kaltura channel link' :
            'Box Folder URL'
          }.`
        )
      }
    }
  }

  switch (sourceType) {
    case 0: // Echo360
      return (
        <>
          <div className="ip-f-p-types-con">
            <h4>Echo360 Instruction</h4>
            <div className="ip-f-p-types-t">An Echo360 Access Link Example</div>
            <div className="ip-f-p-types-d">{exampleEchoAccessLink}</div>
          </div>
          <Grid columns='equal' stackable className="ip-f-grid">
            <Grid.Row className="ct-a-fade-in">
              <Grid.Column>
                <CTForm required textarea
                  label="Echo360 Access Link"
                  color="grey"
                  placeholder="Access Link"
                  error={urlError}
                  onChange={setIndentifier}
                  info={
                    <InfoIcon 
                      header="Echo360 Access Link Example" 
                      content={exampleEchoAccessLink}
                    />
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      )

    case 1: // YouTube
      return (
        <>
          <div className="ip-f-p-types-con">
            <h4>YouTube Instruction</h4>
            <div className="ip-f-p-types-t">An YouTube Playlist URL Example</div>
            <div className="ip-f-p-types-d">{exampleYoutubeURL}</div>
          </div>
          <Grid columns='equal' stackable className="ip-f-grid">
            <Grid.Row className="ct-a-fade-in">
              <Grid.Column>
                <CTForm required textarea
                  label="YouTube Playlist URL"
                  color="grey"
                  placeholder="Playlist URL"
                  error={urlError}
                  onChange={setIndentifier}
                  info={
                    <InfoIcon 
                      header="YouTube Playlist URL Example" 
                      content={exampleYoutubeURL}
                    />
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      )

    case 3: // Kaltura/MediaSpace
      return (
        <>
          <div className="ip-f-p-types-con">
            <h4>Kaltura Instruction</h4>
            <div className="ip-f-p-types-t">An Kaltura Channel URL Example</div>
            <div className="ip-f-p-types-d">{exampleKalturaBUL}</div>
          </div>
          <Grid columns='equal' stackable className="ip-f-grid">
            <Grid.Row className="ct-a-fade-in">
              <Grid.Column>
                <CTForm required textarea
                  label="Kaltura Channel URL"
                  color="grey"
                  placeholder="Kaltura Channel URL"
                  error={urlError}
                  onChange={setIndentifier}
                  info={
                    <InfoIcon 
                      header="Kaltura Channel URL Example" 
                      content={exampleKalturaBUL}
                    />
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      )

    case 4: // Box
      return (
        <>
          <div className="ip-f-p-types-con">
            <h4>Box Instruction</h4>
            <div className="ip-f-p-types-t"><span>IMPORTANT</span></div>
            <div className="ip-f-p-types-d">
              <span>
                Before creating the playlist, please 
                <strong>SHARE</strong>your Box folder with our Box account 
                <strong>cstranscribe@illinois.edu</strong>. 
              </span>
            </div>
            <div className="ip-f-p-types-t">An Box Folder URL Example</div>
            <div className="ip-f-p-types-d">{exampleBoxURL}</div>
          </div>
          <Grid columns='equal' stackable className="ip-f-grid">
            <Grid.Row className="ct-a-fade-in">
              <Grid.Column>
                <CTForm required textarea
                  label="Box Folder URL"
                  color="grey"
                  placeholder="Folder URL"
                  error={urlError}
                  onChange={setIndentifier}
                  info={
                    <InfoIcon 
                      header="Box Folder URL Example" 
                      content={exampleBoxURL}
                    />
                  }
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      )
  
    case 2:
    default:
      return null
  }
}

export default PlaylistIdentifier
