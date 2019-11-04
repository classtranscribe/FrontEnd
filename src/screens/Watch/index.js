/**
 * Watch screen for ClassTranscribe
 */

import React from 'react'
import _ from 'lodash'
import { CTContext } from 'components'
import { 
  WatchHeader,
  Menus,
  ClassTranscribePlayer,
} from './Components'
import './index.css'
// Vars
import { api, util } from 'utils'

export class Watch extends React.Component {
  constructor(props) {
    super(props)
    const { id, courseNumber } = util.parseSearchQuery()
    this.id = id
    if (!id || !courseNumber) window.location = util.links.notfound404()
    util.removeStoredOfferings()
    this.state = { 
      media: api.parseMedia(),
      playlist: {},
      playlists: [],

      starredOfferings: {},
      watchHistory: {},
    }
  }

  componentDidMount() {
    /** GET userMetadata */
    this.getUserMetadata()
    /** GET media, playlist, and playlists */
    this.getWatchData()
  }

  /** Function for getting userMetadata */
  getUserMetadata = () => {
    api.storeUserMetadata({
      setWatchHistory: watchHistory => this.setState({ watchHistory }),
      setStarredOfferings: starredOfferings => this.setState({ starredOfferings })
    })
  }

  /** Function for getting media, playlist, and playlists */
  getWatchData = async () => {
    const { generalError } = this.context
    /** GET media */
    let mediaResponse = null
    try {
      mediaResponse = await api.getMediaById(this.id)
      let media = api.parseMedia(mediaResponse.data)
      this.setState({ media })
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
          this.setState({ playlist })
          console.log('playlist', playlist)
          // playlists
          if (Boolean(playlists)) {
            this.setState({ playlists })
            console.log('playlists', playlists)
          } else {
            const playlistsResponse = await api.getPlaylistsByOfferingId(playlist.offeringId)
            this.setState({ playlists: playlistsResponse.data })
          }
        } 
        // No playlist in state, GET playlist by id and then get playlists
      } else { 
        // playlist
        const playlistResponse = await api.getPlaylistById(playlistId)
        this.setState({ playlist: playlistResponse.data })
        console.log('playlist', playlistResponse.data)
        // playlists
        const { offeringId } = playlistResponse.data
        const playlistsResponse = await api.getPlaylistsByOfferingId(offeringId)
        this.setState({ playlists: playlistsResponse.data })
        console.log('playlists', playlistsResponse.data)
      }
    } catch (error) {
      generalError({ header: "Couldn't load playlists." })
    }

    api.contentLoaded()
  }

  render() { 
    const { media, playlist, playlists } = this.state
    return (
      <main className="watch-bg">
        <WatchHeader 
          {...this.state} 
        />

        <ClassTranscribePlayer 
          {...this.state}
        />
        
        <Menus
          {...this.state}
        />
      </main>
    )
  }
}

Watch.contextType = CTContext
