import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.scss'
import {
  MSPHeader, 
  EPub
} from './Components'
import {
  mspStore, 
  connectWithRedux,
  setup, 
  epub,
  TAB_EPUB,
  TAB_EDIT_TRANS,
} from './Utils'
import { util } from '../../utils'

class MediaSettingsWithRedux extends React.Component {
  constructor(props) {
    super(props)

    this.mediaId = props.match.params.id
    const { tab } = util.links.useHash()
    this.initTab = tab
    setup.init(props)
    epub.init(props)
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
    [
      'media', 
      'tab'
    ],
    [
      'setMedia',
      'setTab',
      'setEpubData',
      'setIsSettingEpub'
    ]
  )

  return (
    <Provider store={mspStore} >
      <MspConnectToRedux {...props} />
    </Provider>
  )
}