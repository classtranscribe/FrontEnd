import React, { createRef } from 'react'
import { Provider } from 'react-redux'
import { mspStore, connectWithRedux } from '../../_redux/media-settings'
import './index.scss'
import {
  MSPHeader
} from './Components'
import {
  setup
} from './Utils'
import { util } from '../../utils'

class MediaSettingsWithRedux extends React.Component {
  constructor(props) {
    super(props)

    this.mediaId = props.match.params.id
    const { tab } = util.links.useHash()
    this.initTab = tab
    setup.init(props)
  }

  componentDidMount() {
    setup.setupMedia(this.mediaId, this.initTab)
  }

  contextRef = createRef()

  render() {
    return (
      <div ref={this.contextRef} className="msp-bg">
        <MSPHeader contextRef={this.contextRef} />
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
      'setTab'
    ]
  )

  return (
    <Provider store={mspStore} >
      <MspConnectToRedux {...props} />
    </Provider>
  )
}