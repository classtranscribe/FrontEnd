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
    const urlStates = util.parseSearchQuery()
    this.id = urlStates.id
    this.courseNumber = urlStates.courseNumber
    
    this.state = { 
      showPlaylist: false,
      media: api.parseMedia(),
      playlist: {},
      playlists: null,
    }
  }

  /**
   * GET media and playlist based on mediaId
   */
  componentDidMount() {
    if (!this.id || !this.courseNumber) window.location = util.links.notfound404()
    const { state } = this.props.location
    if (state) {
      const { media, playlist, playlists } = state
      if (media) this.setState({ media: api.parseMedia(media) })
      if (playlist) this.setState({ playlist: {playlist: playlist, medias: playlist.medias} })
      if (playlists) this.setState({ playlists })
      api.contentLoaded()
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
            })
        })
    }
  }

  playlistTrigger = ()  => {
    this.setState({showPlaylist: !this.state.showPlaylist})
  }  

  render() { 
    const { media, playlist, playlists } = this.state
    const { courseNumber } = this
    return (
      <main className="watch-bg">
        <WatchHeader 
          media={media} 
          playlist={playlist} 
          playlists={playlists}
          courseNumber={courseNumber} 
        />
        <WatchContent 
          media={media} 
          playlist={playlist} 
          courseNumber={courseNumber} 
        />
      </main>
    )
  }
}
