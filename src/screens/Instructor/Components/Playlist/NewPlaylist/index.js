import React, { useState, useEffect } from 'react'
import { Button } from 'pico-ui'
import { Grid } from 'semantic-ui-react'
import { CTForm } from '../../../../../components'

import SourceTypes from './SourceTypes'
import PlaylistIdentifier from './PlaylistIdentifier'

import { api, util } from '../../../../../utils'
import { plControl } from '../../../Utils'
import './index.css'

export default function NewPlaylist({
  offeringId,
  noPlaylist=false
}) {

  const [name, setName] = useState('')
  const [type, setType] = useState(2)
  const [url, setUrl] = useState('')

  const defaultType = 2

  const setPlaylistName = name_ => {
    setName(name_)
  }

  const setPlaylistType = type_ => {
    setType(-1)
    setTimeout(() => setType(type_), 200)
    setUrl('')
  }

  const onSave = () => {
    plControl.createPlaylist({
      offeringId, name, 
      sourceType: type,
      playlistIdentifier: url
    })
  }

  useEffect(() => {
    util.links.replaceSearch({})
  }, [])

  return (
    <div className="ct-a-fade-in ip-edit-p-con" data-scroll>
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
        <SourceTypes />

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
                position="up"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <PlaylistIdentifier 
          url={url}
          setUrl={setUrl}
          sourceType={type}
        />
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