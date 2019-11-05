/**
 * Watch screen for ClassTranscribe
 */

import React from 'react'
import { Provider, connect } from 'react-redux'
import _ from 'lodash'
import { CTContext } from 'components'
import { 
  WatchHeader,
  Menus,
  ClassTranscribePlayer,
} from './Components'
import './index.css'
// Vars
import { watchStore, connectWithRedux } from '_redux/watch'
import { api, util } from 'utils'

export class WatchWithRedux extends React.Component {
  constructor(props) {
    super(props)
    console.log('success', props.media)
    const { id, courseNumber } = util.parseSearchQuery()
    this.id = id
    if (!id || !courseNumber) window.location = util.links.notfound404()
    util.removeStoredOfferings()
  }

  componentDidMount() {
    /** GET userMetadata */
    this.getUserMetadata()
    /** GET media, playlist, and playlists */
    this.getWatchData()
  }

  /** Function for getting userMetadata */
  getUserMetadata = () => {
    const { setWatchHistory, setStarredOfferings } = this.props
    // api.storeUserMetadata({
    //   setWatchHistory,
    //   setStarredOfferings
    // })
  }

  /** Function for getting media, playlist, and playlists */
  getWatchData = async () => {
    const { generalError } = this.context
    /** GET media */
    let mediaResponse = null
    try {
      mediaResponse = await api.getMediaById(this.id)
      let media = api.parseMedia(mediaResponse.data)
      this.props.setMedia(media)
      console.log('media', media)
    } catch (error) {
      generalError({ header: "Couldn't load the video :(" })
      return;
    }

    const { playlistId } = mediaResponse.data

    /** GET playlist, and playlists */
    try {
      const { state } = this.props.location
      if (Boolean(state)) {
        const { playlist, playlists } = state
        if (Boolean(playlist)) {
          // playlist
          this.props.setPlaylist(playlist)
          console.log('playlist', playlist)
          // playlists
          if (Boolean(playlists)) {
            this.props.setPlaylists(playlists)
            console.log('playlists', playlists)
          } else {
            const playlistsResponse = await api.getPlaylistsByOfferingId(playlist.offeringId)
            this.props.setPlaylists(playlistsResponse.data)
          }
        } 
        // No playlist in state, GET playlist by id and then get playlists
      } else { 
        // playlist
        const playlistResponse = await api.getPlaylistById(playlistId)
        this.props.setPlaylist(playlistResponse.data)
        console.log('playlist', playlistResponse.data)
        // playlists
        const { offeringId } = playlistResponse.data
        const playlistsResponse = await api.getPlaylistsByOfferingId(offeringId)
        this.props.setPlaylists(playlistsResponse.data)
        console.log('playlists', playlistsResponse.data)
      }
    } catch (error) {
      generalError({ header: "Couldn't load playlists." })
    }

    api.contentLoaded()
  }

  render() { 
    return (
      <main className="watch-bg">
        <WatchHeader />
        <ClassTranscribePlayer />
        <Menus />
      </main>
    )
  }
}

WatchWithRedux.contextType = CTContext

export function Watch(props) {
  const WatchConnectToRedux = connectWithRedux(
    WatchWithRedux
  )
  return (
    <Provider store={watchStore}>
      <WatchConnectToRedux {...props} />
    </Provider>
  )
}