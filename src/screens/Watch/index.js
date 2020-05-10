/**
 * Watch screen for ClassTranscribe
 */

import React from 'react'
import { Provider } from 'react-redux'
import _ from 'lodash'
import { 
  ErrorWrapper,
  WatchHeader,
  Menus,
  Modals,
  ClassTranscribePlayer,
  Search,
  ControlBar,
  Transcriptions,
  TabEventHelperButtons,
  UpNext,
  TransCtrlButtons,
} from './Components'
import './index.css'
import './zIndex.css'
// Vars
import { util } from '../../utils'
import { 
  watchStore, 
  connectWithRedux,
  generateWatchUserGuide,
  setup,
  videoControl,
  transControl,
  searchControl,  
  preferControl,
  keydownControl,
  ERR_INVALID_MEDIA_ID, 
} from './Utils'

export class WatchWithRedux extends React.Component {
  constructor(props) {
    super(props)

    let error = null
    const { id } = util.links.useSearch()
    this.id = id
    if (!id) error = ERR_INVALID_MEDIA_ID

    this.state = { error }
    let setError = error => this.setState({ error })

    /** Init controls */
    setup.init(props, setError)
    transControl.init(props)
    searchControl.init(props)
    preferControl.init(props)
  }

  componentDidMount() {
    /** GET media, playlist  */
    setup.setupMedias()
    /** Add keydown event handler */
    keydownControl.addKeyDownListener()
    /** Add resize event listener */
    videoControl.addWindowEventListener()
  }

  componentWillUnmount() {
    this.props.resetStates()
  }

  showHWatchUserGuide = () => {
    let watchUserGuide = generateWatchUserGuide()
    watchUserGuide.start()
  }

  render() { 
    const { error } = this.state

    return (
      <main className="watch-bg" id="watch-page">
        {
          Boolean(error)
          ?
          <>
            <WatchHeader plain />
            <ErrorWrapper error={error} />
          </>
          :
          <>
            <TabEventHelperButtons />
            <Modals />
            <WatchHeader showGuide={this.showHWatchUserGuide}/>
            <Search />
            <Menus />
            <ClassTranscribePlayer />
            <UpNext />
            <TransCtrlButtons />
            <Transcriptions />
            <ControlBar />
          </>
        }
      </main>
    )
  }
}

export function Watch(props) {
  const WatchConnectToRedux = connectWithRedux(
    WatchWithRedux,
    ['media', 'playlist'],
    [
      'setMedia', 'setPlaylist', 'setPlaylists', 
      'setOffering', 'changeVideo',
      // transControl
      'setCurrTrans', 'setTranscriptions', 'setTranscript', 
      'setCaptions', 'setCurrCaption', 'setDescriptions', 'setCurrDescription',
      'setCurrEditing', 'setBulkEditing',
      'setOpenCC', 'setOpenAD', 'setTransView',
      'cc_setColor', 'cc_setBG', 'cc_setSize', 'cc_setOpacity', 'cc_setPosition', 'cc_setFont',
      // promptControl
      'setPrompt',
      // searchControl
      'setSearch',
      // others
      'resetStates',
    ]
  )
  return (
    <Provider store={watchStore}>
      <WatchConnectToRedux {...props} />
    </Provider>
  )
}