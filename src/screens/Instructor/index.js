import React from 'react'
import { Provider } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { ClassTranscribeHeader } from '../../components'
import {
  Loader,
  Course,
  Sidebar,
  Prompts,
  Playlist,
  Confirmation,
} from './Components'

import {
  instpStore, 
  connectWithRedux,

  setup,
  plControl,
  offControl,
  mediaControl,
  promptControl,
} from './Utils'

import { util } from '../../utils'
import './index.css'

export class InstructorWithRedux extends React.Component {
  constructor(props) {
    super(props)
    util.links.title('My Courses')
    setup.init(props)
    plControl.init(props)
    offControl.init(props)
    mediaControl.init(props)
    promptControl.init(props)
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
          subtitle="Instructor"
          showSiderBar={this.showSiderBar} 
          display={sidebar}
        />

        <Sidebar
          showSiderBar={this.showSiderBar}
        />

        <Prompts />

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

export function Instructor(props) {
  const InstpConnectToRedux = withRouter(connectWithRedux(
    InstructorWithRedux,
    [
      'sidebar',
      'loading',
      'offerings',
    ],
    [
      'setPrompt',
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