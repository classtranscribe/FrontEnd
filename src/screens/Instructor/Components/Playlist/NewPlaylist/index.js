import React, { useState, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { CTForm, CTButton } from 'components'
import { api, util } from 'utils'
import { PlaylistIcon } from '../../PlaylistIcon'
import { InfoIcon } from '../../InfoIcon'
import './index.css'

const exampleYoutubeURL = "https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3"
const exampleEchoAccessLink = "https://echo360.org/section/59cc95a1-b088-46e3-80a3-7e3c6921a40f/public"

export default function NewPlaylist({

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

  const setEchoLink = value => {
    setUrl(value)
    if (Boolean(value)) {
      if (!value.includes('https://echo360.org/section/')) {
        setUrlError('Please enter a valid Echo360 Access Link.')
      } else {
        setUrlError(null)
      }
    }
  }

  const setYoutubeLink = value => {
    setUrl(value)
    if (Boolean(value)) {
      const { list } = util.parseSearchQuery(value)
      console.error(list)
      if (!list) {
        setUrlError('Please enter a valid YouTube playlist URL.')
      } else {
        setUrlError(null)
      }
    }
  }


  return (
    <div className="ip-edit-c-con ct-a-fade-in ip-edit-p-con">
      <h2>New Playlist</h2>

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
            <Grid.Row className="ct-a-fade-in">
              <Grid.Column>
                <CTForm required textarea
                  label="YouTube Playlist URL"
                  color="grey"
                  placeholder="Playlist URL"
                  error={urlError}
                  onChange={setYoutubeLink}
                  info={
                    <InfoIcon 
                      header="YouTube Playlist URL Example" 
                      content={exampleYoutubeURL}
                    />
                  }
                />
              </Grid.Column>
            </Grid.Row>
          }
          {
            type === 0
            &&
            <Grid.Row className="ct-a-fade-in">
              <Grid.Column>
                <CTForm required textarea
                  label="Echo360 Access Link"
                  color="grey"
                  placeholder="Access Link"
                  error={urlError}
                  onChange={setEchoLink}
                  info={
                    <InfoIcon 
                      header="Echo360 Access Link Example" 
                      content={exampleEchoAccessLink}
                    />
                  }
                />
              </Grid.Column>
            </Grid.Row>
          }
        </Grid>
      </div>

      <div className="ip-f-form-con">
        <form className="w-100">
          <div className="ct-d-r-center-v w-100 mt-3 ip-f-btn-group ct-btn-group">
            <CTButton
              color="green"
              text="Save"
              size="big"
              //onClick={() => offControl.save(newCourse)}
            />
          </div>
        </form>
      </div>
    </div>
  )
}