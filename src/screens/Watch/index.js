/**
 * Watch screen for ClassTranscribe
 */

import React from 'react'
import _ from 'lodash'
// UI
import { WatchHeader, WatchContent } from './Components'
import { VideoTips } from 'components'
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

      starredOfferings: {},
      watchHistory: {},
      onboarded: true,
    }
  }

  /**
   * GET media and playlist based on mediaId
   */
  componentDidMount() {
    // Get userMetadata
    this.getUserMetadata()

    const { state } = this.props.location
    if (state) {
      const { /* media, */ playlist, playlists } = state
      api.getMediaById(this.id)
        .then( ({data}) => {
          // console.log('media', data)
          const media = api.parseMedia(data)
          this.setState({ media })
          util.links.title(media.mediaName)
          api.contentLoaded()
          this.sendUserAction('changevideo', { changeTo_mediaId: data.id })
        })
      // if (media) this.setState({ media: api.parseMedia(media) })
      if (playlist) this.setState({ playlist })
      if (playlists) this.setState({ playlists })
      this.offeringId = playlist.offeringId
      // api.contentLoaded()
    } else {
      api.getMediaById(this.id)
        .then( ({data}) => {
          console.log('load - media', data)
          this.sendUserAction('changevideo', { changeTo_mediaId: data.id })
          this.setState({ media: api.parseMedia(data) })
          api.getPlaylistById(data.playlistId)
            .then(({data}) => {
              // console.log('playlist', data)
              this.setState({ playlist: data })
              this.offeringId = data.offeringId
              api.contentLoaded()
              api.getPlaylistsByOfferingId(data.offeringId)
                .then(({data}) => {
                  // console.log('playlists', data)
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

  getUserMetadata = () => {
    api.storeUserMetadata({
      setWatchHistory: watchHistory => this.setState({ watchHistory }),
      setStarredOfferings: starredOfferings => this.setState({ starredOfferings }),
      // setOnboarded: onboarded => this.setState({ onboarded: Boolean(onboarded['watch']) })
    })
  }

  playlistTrigger = ()  => {
    this.setState({showPlaylist: !this.state.showPlaylist})
  }  

  sendUserAction = (action, json={}, ratio) => {
    const { media, watchHistory, starredOfferings } = this.state
    const { timeStamp } = json
    api.sendUserAction(action, {
      json,
      mediaId: media.id,
      offeringId: this.offeringId
    })
    if (ratio) {
      watchHistory[media.id] = { 
        timeStamp, ratio,
        offeringId: this.offeringId,
        lastModifiedTime: new Date(),
      }

      const mediaIds = Object.keys(watchHistory)
      if (mediaIds.length > 30) {
        const whArray = []
        mediaIds.forEach( mediaId => {
          whArray.push({ mediaId, date: watchHistory[mediaId].lastModifiedTime })
        })
        var toRemove = _.sortBy(whArray, ['date'])[0]
        delete watchHistory[toRemove.mediaId]
      }

      api.postUserMetaData({ 
        watchHistory: JSON.stringify(watchHistory), 
        starredOfferings: JSON.stringify(starredOfferings)
      })//.then(() => console.log('kuuuuu'))
    }
  }

  render() { 
    const { media, playlist, playlists, isMobile, watchHistory, onboarded } = this.state
    return (
      <main className="watch-bg">
        <VideoTips onboarded={onboarded} />
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
          watchHistory={watchHistory}
          sendUserAction={this.sendUserAction}
        />
      </main>
    )
  }
}
