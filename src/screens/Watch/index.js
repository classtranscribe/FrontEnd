import React from 'react'
import { WatchHeader, CTPlayerRow, UpNext } from './Components'
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
    const { media } = this.state
    return (
      <main className="watch-bg">
        <WatchHeader />
        <UpNext {...this.state} courseNumber={this.courseNumber}/>
        <div className="watch-content">
          <CTPlayerRow media={media} />
        </div>
      </main>
    )
  }
}
