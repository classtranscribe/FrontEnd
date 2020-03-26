/**
 * Watch screen for ClassTranscribe
 */

import React from 'react'
import { Provider } from 'react-redux'
import _ from 'lodash'
import { CTContext } from '../../components'
import { 
  WatchHeader,
  Menus,
  Modals,
  ClassTranscribePlayer,
  Search,
  ControlBar,
  Transcriptions,
  TabEventHelperButtons,
  Prompts,
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

  setup,
  videoControl,
  transControl, 
  promptControl, 
  searchControl,  
  preferControl,
  keydownControl, 
} from './Utils'

export class WatchWithRedux extends React.Component {
  constructor(props) {
    super(props)
    const { id } = util.parseSearchQuery()
    this.id = id
    if (!id) window.location = util.links.notfound404()
    util.removeStoredOfferings()

    /** Init controls */
    setup.init(props)
    transControl.init(props)
    searchControl.init(props)
    promptControl.init(props)
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

  render() { 
    return (
      <main className="watch-bg" id="watch-page">
        <TabEventHelperButtons />
        <Modals />
        <WatchHeader />
        <Search />
        <Menus />
        <ClassTranscribePlayer />
        <UpNext />
        <TransCtrlButtons />
        <Transcriptions />
        <ControlBar />
        <Prompts />
      </main>
    )
  }
}

WatchWithRedux.contextType = CTContext

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