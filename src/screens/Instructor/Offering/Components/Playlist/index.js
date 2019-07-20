import React, { useState, useEffect } from 'react'
import PlaylistHeader from './PlaylistHeader'
import { api } from '../../../../../util'

export function Playlist({ match }) {
  const playlistId = match.params.id
  const [playlist, setPlaylist] = useState({})
  const [medias, setMedias] = useState([])

  /**
   * GET data based on playlistId
   */
  useEffect(() => {
    api.getPlaylistById(playlistId)
      .then( ({data}) => {
        setPlaylist(() => data.playlist)
        setMedias(() => data.medias)
        console.log(data)
      })
  }, [playlistId])

  return (
    <PlaylistHeader {...playlist} />
  )
}