import React from 'react'
import { WatchHeader, CTPlayerRow } from './Components'
import './index.css'
import { api } from '../../util'

export class Watch extends React.Component {
  constructor(props) {
    super(props)

    this.id = this.props.match.params.id
    this.courseNumber = this.props.match.params.courseNumber
    this.state = { 
      showPlaylist: false,
      media: {},
      playlist: {},
    }
  }

  componentDidMount() {
    api.getMediaById(this.id)
      .then( ({data}) => {
        console.log('media', data)
        this.setState({ media: data })
        api.getPlaylistById(data.playlistId)
          .then(({data}) => {
            console.log('playlist', data)
            this.setState({ playlist: data })
          })
      })
    api.contentLoaded()
  }

  playlistTrigger = ()  => {
    this.setState({showPlaylist: !this.state.showPlaylist})
  }  

  render() { 
    const { media, playlist } = this.state
    const { courseNumber } = this
    return (
      <main className="watch-bg">
        <WatchHeader />
        <div className="watch-content">
          <CTPlayerRow media={media} playlist={playlist} courseNumber={courseNumber} />
        </div>
      </main>
    )
  }
}
