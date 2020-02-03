import React, { useState } from 'react'
import { Button } from 'pico-ui'
import { Grid } from 'semantic-ui-react'
import { CTForm } from 'components'

import { api } from 'utils'
import { plControl } from '../../../Utils'

import { PlaylistIcon } from '../../PlaylistIcon'
import { InfoIcon } from '../../InfoIcon'
import './index.css'

const exampleYoutubeURL = "https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3"
const exampleEchoAccessLink = "https://echo360.org/section/59cc95a1-b088-46e3-80a3-7e3c6921a40f/public"

export default function NewPlaylist({
  offeringId,
  noPlaylist=false
}) {

  const [name, setName] = useState('')
  const [type, setType] = useState(2)
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState(null)

  const defaultType = 2

  const setPlaylistName = name_ => {
    setName(name_)
  }

  const setPlaylistType = type_ => {
    setType(type_)
  }

  const setIndentifier = value => {
    setUrl(value)
    if (Boolean(value)) {
      if (plControl.isValidIdURL(type, value)) {
        setUrlError(null)
      } else {
        setUrlError(
          `Please enter a valid ${type === 0 ? 'Echo360 Access Link' : 'YouTube playlist URL'}.`
        )
      }
    }
  }

  const onSave = () => {
    plControl.createPlaylist({
      offeringId, name, 
      sourceType: type,
      playlistIdentifier: url
    })
  }


  return (
    <div className="ct-a-fade-in ip-edit-p-con">
      <h2 className="ip-title">{noPlaylist ? 'Create Your First Playlist' : 'New Playlist'}</h2>

      <div className="ip-f-section">
        <div className="ip-f-title">
          <h3>playlist name</h3>
        </div>
      

        <Grid columns='equal' stackable className="ip-f-grid">
          <Grid.Row>
            <Grid.Column>
              <CTForm required
                label="Playlist Name"
                color="grey"
                placeholder="Playlist Name"
                onChange={setPlaylistName}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

      <div className="ip-f-section">
        <div className="ip-f-title">
          <h3>playlist type</h3>
        </div>

        <div className="ip-f-p-types-con">
          <h4>Playlist Types</h4>
          <div className="ip-f-p-types-list">
            <div className="ip-f-p-types-item">
              <div className="ip-f-p-types-t"><PlaylistIcon type={0} /> Echo360</div>
              <div className="ip-f-p-types-d">
                Host videos from Echo360 using <strong>ACCESS LINK</strong> of your Echo360 course.
              </div>
            </div>

            <div className="ip-f-p-types-item">
              <div className="ip-f-p-types-t"><PlaylistIcon type={1} /> YouTube</div>
              <div className="ip-f-p-types-d">
                Host videos from YouTube using <strong>PLAYLIST ID</strong> of your YouTube playlist.
              </div>
            </div>

            <div className="ip-f-p-types-item">
              <div className="ip-f-p-types-t"><PlaylistIcon type={2} /> Upload</div>
              <div className="ip-f-p-types-d">
                Manually upload video files (MP4 file).
              </div>
            </div>
          </div>
        </div>

        <Grid columns='equal' stackable className="ip-f-grid">
          <Grid.Row>
            <Grid.Column>
              <CTForm required select
                label="Playlist Type"
                color="grey"
                defaultValue={defaultType}
                options={CTForm.getOptions(api.playlistTypes.slice().reverse(), 'id', 'name', 'description')}
                onChange={setPlaylistType}
                description="Choose playlist type."
              />
            </Grid.Column>
          </Grid.Row>
          {
            type === 1
            &&
            <>
              <div className="ip-f-p-types-con">
                <h4>YouTube playlist URL</h4>
                <div className="ip-f-p-types-t">For Example</div>
                <div className="ip-f-p-types-d">{exampleYoutubeURL}</div>
              </div>
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
            </>
          }
          {
            type === 0
            &&
            <>
              <div className="ip-f-p-types-con">
                <h4>Echo360 Access Link</h4>
                <div className="ip-f-p-types-t">For Example</div>
                <div className="ip-f-p-types-d">{exampleEchoAccessLink}</div>
              </div>
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
            </>
          }
        </Grid>
      </div>

      <div className="ip-f-form-con">
        <div className="ct-d-r-center-v w-100 mt-3 ip-f-btn-group ct-btn-group">
          <Button uppercase
            color="teal"
            text="create playlist"
            onClick={onSave}
            disabled={!name || !plControl.isValidIdURL(type, url)}
          />
        </div>
      </div>
    </div>
  )
}