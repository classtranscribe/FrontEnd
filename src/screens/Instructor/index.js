import React from 'react'
import { Provider } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { instpStore, connectWithRedux } from '_redux/instructor'
import { ClassTranscribeHeader, CTContext } from 'components'
import {
  Loader,
  Sidebar,
  Course,
  Playlist,
  Confirmation,
} from './Components'
import './index.css'
import {
  mediaControl,
  offControl,
  plControl,
  setup,
} from './Utils'
import { util } from 'utils'

export class InstructorWithRedux extends React.Component {
  constructor(props) {
    super(props)
    util.links.title('My Courses')
    setup.init(props)
    plControl.init(props)
    offControl.init(props)
    mediaControl.init(props)
  }

  showSiderBar = value => {
    const { setSidebar, sidebar } = this.props
    if (typeof value === "boolean") {
      setSidebar( value )
    } else {
      setSidebar( !sidebar )
    }
  }

  componentDidMount() {
    setup.setupOfferings()
  }

  render() {
    const { sidebar, loading } = this.props
    const paddingLeft = {
      paddingLeft: (sidebar && window.innerWidth > 900) ? '19em' : '0'
    }

    return (
      <div className="ip-bg">
        <ClassTranscribeHeader
          showSiderBar={this.showSiderBar} 
          display={sidebar}
        />

        <Sidebar
          showSiderBar={this.showSiderBar}
        />

        <main className="ip-container" style={paddingLeft}>
          {Boolean(loading.type) && <Loader />}
          <Course />
          <Playlist />
          <Confirmation />
        </main>
      </div>
    )
  }
}

InstructorWithRedux.contextType = CTContext

export function Instructor(props) {
  const InstpConnectToRedux = withRouter(connectWithRedux(
    InstructorWithRedux,
    [
      'sidebar',
      'loading',
      'offerings',
    ],
    [
      'setSidebar',
      'setLoading',
      'setConfirmation',
      // Basics
      'setDeparts',
      'setTerms',
      'setOfferings', 
      // Course
      'setOffering',
      'setIsEditingOffering',
      // Playlists
      'setPlaylists',
      'setPlaylist',
      // media
      'setIsSelectingVideos',
      'setSelectedVideos'
    ]
  ))

  return (
    <Provider store={instpStore}>
      <InstpConnectToRedux {...props} />
    </Provider>
  )
}