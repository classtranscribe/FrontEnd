/**
 * Watch screen for ClassTranscribe
 */

import React from 'react'
// UI
import { WatchHeader, WatchContent } from './Components'
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
      showPlaylist: false,
      isMobile: window.innerWidth < 650 ? true : false,

      media: api.parseMedia(),
      playlist: {},
      playlists: [],
    }
  }

  /**
   * GET media and playlist based on mediaId
   */
  componentDidMount() {
    const { state } = this.props.location
    if (state) {
      const { /* media, */ playlist, playlists } = state
      api.getMediaById(this.id)
        .then( ({data}) => {
          console.log('media', data)
          const media = api.parseMedia(data)
          this.setState({ media })
          util.links.title(media.mediaName)
          api.contentLoaded()
        })
      // if (media) this.setState({ media: api.parseMedia(media) })
      if (playlist) this.setState({ playlist })
      if (playlists) this.setState({ playlists })
      // api.contentLoaded()
    } else {
      api.getMediaById(this.id)
        .then( ({data}) => {
          console.log('media', data)
          this.setState({ media: api.parseMedia(data) })
          api.getPlaylistById(data.playlistId)
            .then(({data}) => {
              console.log('playlist', data)
              this.setState({ playlist: data })
              api.contentLoaded()
              api.getPlaylistsByOfferingId(data.offeringId)
                .then(({data}) => {
                  console.log('playlists', data)
                  this.setState({ playlists: data })
                })
            })
        })
    }

    window.addEventListener('resize', () => {
      const { isMobile } = this.state
      if (window.innerWidth > 650 && isMobile) {
        this.setState({ isMobile: false })
      } else if (window.innerWidth <= 650 && !isMobile) {
        this.setState({ isMobile: true })
      }
    })
  }

  playlistTrigger = ()  => {
    this.setState({showPlaylist: !this.state.showPlaylist})
  }  

  sendUserAction = (action, json = {}) => {
    const { media, playlist } = this.state
    api.sendUserAction(action, {
      json,
      mediaId: media.id,
      offeringId: playlist.offeringId
    })
  }

  render() { 
    const { media, playlist, playlists, isMobile } = this.state
    return (
      <main className="watch-bg">
        <WatchHeader 
          media={media} 
          playlist={playlist} 
          playlists={playlists}
          sendUserAction={this.sendUserAction}
        />
        <WatchContent 
          media={media} 
          playlist={playlist} 
          playlists={playlists}
          isMobile={isMobile}
          sendUserAction={this.sendUserAction}
        />
      </main>
    )
  }
}
