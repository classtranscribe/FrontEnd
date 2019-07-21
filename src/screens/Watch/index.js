import React from 'react'
import { WatchHeader, CTPlayerRow } from './Components'
import './index.css'
import { api } from '../../util'

export class Watch extends React.Component {
  constructor(props) {
    super(props)

    this.id = this.props.match.params.id
    this.state = { 
      showPlaylist: false,
      media: {}
    }
  }

  componentDidMount() {
    api.getMediaById(this.id)
      .then( ({data}) => {
        console.log(data)
        this.setState({ media: data })
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
        <div className="watch-content">
          <CTPlayerRow media={media} />
        </div>
      </main>
    )
  }
}
