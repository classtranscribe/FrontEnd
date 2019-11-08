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
  ControlBar
} from './Components'
import './index.css'
// Vars
import { watchStore, connectWithRedux } from '_redux/watch'
import { api, util } from 'utils'
import { keydownControl } from './Utils'

export class WatchWithRedux extends React.Component {
  constructor(props) {
    super(props)
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
    /** Add keydown event handler */
    keydownControl.addKeyDownListener()
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
    const { setMedia, setPlaylist, setPlaylists, setTranscriptions, setCurrTrans } = this.props
    /** GET media */
    let mediaResponse = null
    try {
      mediaResponse = await api.getMediaById(this.id)
      let media = api.parseMedia(mediaResponse.data)
      setMedia(media)
      setTranscriptions(media.transcriptions)
      setCurrTrans(media.transcriptions[0] || {})
      console.log('media', media)
      console.log('transcriptions', media.transcriptions)
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
          setPlaylist(playlist)
          console.log('playlist', playlist)
          // playlists
          if (Boolean(playlists)) {
            setPlaylists(playlists)
            console.log('playlists', playlists)
          } else {
            const playlistsResponse = await api.getPlaylistsByOfferingId(playlist.offeringId)
            setPlaylists(playlistsResponse.data)
          }
        } 
        // No playlist in state, GET playlist by id and then get playlists
      } else { 
        // playlist
        const playlistResponse = await api.getPlaylistById(playlistId)
        setPlaylist(playlistResponse.data)
        console.log('playlist', playlistResponse.data)
        // playlists
        const { offeringId } = playlistResponse.data
        const playlistsResponse = await api.getPlaylistsByOfferingId(offeringId)
        setPlaylists(playlistsResponse.data)
        console.log('playlists', playlistsResponse.data)
      }
    } catch (error) {
      generalError({ header: "Couldn't load playlists." })
    }

    api.contentLoaded()
  }

  render() { 
    return (
      <main className="watch-bg" id="watch-page">
        <WatchHeader />
        <ClassTranscribePlayer />
        <Menus />
        <ControlBar />
      </main>
    )
  }
}

WatchWithRedux.contextType = CTContext

export function Watch(props) {
  const WatchConnectToRedux = connectWithRedux(
    WatchWithRedux,
    ['media', 'playlist', 'playlists'],
    ['setMedia', 'setPlaylist', 'setPlaylists', 'setCurrTrans', 'setTranscriptions']
  )
  return (
    <Provider store={watchStore}>
      <WatchConnectToRedux {...props} />
    </Provider>
  )
}