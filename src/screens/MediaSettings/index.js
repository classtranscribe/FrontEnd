import React from 'react'
import { Provider } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import { mspStore, connectWithRedux } from '_redux/media-settings'

export function MediaSettingsWithRedux() {

  let mediaId = useParams().id
  let tab = useLocation().hash

  return (
    <div>
      {mediaId} - tab {tab}
    </div>
  )
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
    []
  )

  return (
    <Provider store={mspStore} >
      <MspConnectToRedux {...props} />
    </Provider>
  )
}