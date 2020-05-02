import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.scss'
import {
  MSPHeader, 
  EPub
} from './Components'
import { 
  setup, 
  connectWithRedux,
  mspContext,
  mspStore,
  TAB_EPUB,
  TAB_EDIT_TRANS,
} from './Utils'
import { util } from '../../utils'

import { epubContext, epubStore } from './Utils/epub'

class MediaSettingsWithRedux extends React.Component {
  constructor(props) {
    super(props)

    setup.verifyUser()

    this.mediaId = props.match.params.id
    setup.init(props)
  }

  componentDidMount() {
    setup.setupMedia(this.mediaId)
  }

  render() {
    return (
      <div className="msp-bg">
        <MSPHeader />

        <div className="msp-content">
          <Route exact
            path={util.links.instMediaSettings(this.mediaId)} 
            render={() => <Redirect to={util.links.instMediaSettings(this.mediaId, TAB_EDIT_TRANS)} />}   
          />

          <Route path={util.links.instMediaSettings(this.mediaId, TAB_EPUB)} component={EPub} />
        </div>
      </div>
    )
  }
}


/** 
 * Component used to connect to msp redux store
 */
export function MediaSettings(props) {

  const MspConnectToRedux = connectWithRedux(
    MediaSettingsWithRedux,
    [],
    [
      'setMedia',
      'setPlaylist',
      'setTab',
      'setEpubData',
      'setIsManagingChapters',
      'setError'
    ],
    mspContext
  )

  return (
    <Provider store={mspStore} context={mspContext}>
      <Provider store={epubStore} context={epubContext}>
        <MspConnectToRedux {...props} />
      </Provider>
    </Provider>
  )
}