/**
 * Watch screen for ClassTranscribe
 */

import React from 'react'
import { Provider } from 'react-redux'
import _ from 'lodash'
import { CTContext } from 'components'
import { 
  WatchHeader,
  Menus,
  ClassTranscribePlayer,
  ControlBar,
  Transcriptions,
  TabEventHelperButtons,
  Prompts
} from './Components'
import './index.css'
import './zIndex.css'
// Vars
import { watchStore, connectWithRedux } from '_redux/watch'
import { api, util } from 'utils'
import { 
  keydownControl, 
  videoControl,
  transControl, 
  promptControl, 
  searchControl,  
  preferControl
} from './Utils'

export class WatchWithRedux extends React.Component {
  constructor(props) {
    super(props)
    const { id, courseNumber } = util.parseSearchQuery()
    this.id = id
    if (!id || !courseNumber) window.location = util.links.notfound404()
    util.removeStoredOfferings()
  }

  componentDidMount() {
    /** Init controls */
    this.initTransControl()
    this.initPromptControl()
    this.initSearchControl()
    this.initPreferenceControl()
    /** GET userMetadata */
    this.getUserMetadata()
    /** GET media, playlist, and playlists */
    this.getWatchData()
    /** Add keydown event handler */
    keydownControl.addKeyDownListener()
    /** Add resize event listener */
    this.addWindowResizeListener()
  }

  initTransControl = () => {
    const { 
      setCurrTrans, setTranscriptions, setTranscript, setCaptions, setCurrCaption, setDescriptions, setCurrDescription, 
      setCurrEditing, setOpenCC, setOpenAD,
      cc_setColor, cc_setBG, cc_setSize, cc_setOpacity, cc_setPosition, cc_setFont
    } = this.props

    transControl.init({ 
      setCurrTrans, setTranscriptions, setTranscript, setCaptions, setCurrCaption, setDescriptions, setCurrDescription, 
      setCurrEditing, setOpenCC, setOpenAD,
      cc_setColor, cc_setBG, cc_setSize, cc_setOpacity, cc_setPosition, cc_setFont
    })
  }

  initPromptControl = () => {
    const { setPrompt } = this.props
    promptControl.init(setPrompt)
  }

  initSearchControl = () => {
    const { setSearch } = this.props
    searchControl.init(setSearch)
  }

  initPreferenceControl = () => {
    preferControl.init({})
  }

  addWindowResizeListener = () => {
    window.addEventListener('resize', () => {
      videoControl.addWindowResizeListenerForScreenMode()
    })
  }

  /** Function for getting userMetadata */
  getUserMetadata = () => {
    const { setWatchHistory, setStarredOfferings } = this.props
    // api.storeUserMetadata({
    //   setWatchHistory,
    //   setStarredOfferings
    // })
  }

  /** Function for getting media, playlist, and playlists */
  getWatchData = async () => {
    const { generalError } = this.context
    const { setMedia, setPlaylist, setPlaylists } = this.props
    /** GET media */
    let mediaResponse = null
    try {
      mediaResponse = await api.getMediaById(this.id)
      let media = api.parseMedia(mediaResponse.data)
      setMedia(media)
      transControl.transcriptions(media.transcriptions)
      // console.log('media', media)
    } catch (error) {
      generalError({ header: "Couldn't load the video :(" })
      return;
    }

    const { playlistId } = mediaResponse.data

    /** GET playlist, and playlists */
    try {
      const { state } = this.props.location
      if (Boolean(state)) {
        const { playlist, playlists } = state
        if (Boolean(playlist)) {
          // playlist
          setPlaylist(playlist)
          // console.log('playlist', playlist)
          // playlists
          if (Boolean(playlists)) {
            setPlaylists(playlists)
            // console.log('playlists', playlists)
          } else {
            const playlistsResponse = await api.getPlaylistsByOfferingId(playlist.offeringId)
            setPlaylists(playlistsResponse.data)
          }
        } 
        // No playlist in state, GET playlist by id and then get playlists
      } else { 
        // playlist
        const playlistResponse = await api.getPlaylistById(playlistId)
        setPlaylist(playlistResponse.data)
        // console.log('playlist', playlistResponse.data)
        // playlists
        const { offeringId } = playlistResponse.data
        const playlistsResponse = await api.getPlaylistsByOfferingId(offeringId)
        setPlaylists(playlistsResponse.data)
        // console.log('playlists', playlistsResponse.data)
      }
    } catch (error) {
      generalError({ header: "Couldn't load playlists." })
    }

    api.contentLoaded()
  }

  render() { 
    return (
      <main className="watch-bg" id="watch-page">
        <h1 className="accessbility_hide">Watch Page</h1>
        <TabEventHelperButtons />
        <WatchHeader />
        <ClassTranscribePlayer />
        <Transcriptions />
        <Menus />
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
    ['media', 'playlist', 'playlists'],
    [
      'setMedia', 'setPlaylist', 'setPlaylists', 
      // transControl
      'setCurrTrans', 'setTranscriptions', 'setTranscript', 'setCaptions', 'setCurrCaption', 'setDescriptions', 'setCurrDescription',
      'setCurrEditing', 'setOpenCC', 'setOpenAD',
      'cc_setColor', 'cc_setBG', 'cc_setSize', 'cc_setOpacity', 'cc_setPosition', 'cc_setFont',
      // promptControl
      'setPrompt',
      // searchControl
      'setSearch'
    ]
  )
  return (
    <Provider store={watchStore}>
      <WatchConnectToRedux {...props} />
    </Provider>
  )
}