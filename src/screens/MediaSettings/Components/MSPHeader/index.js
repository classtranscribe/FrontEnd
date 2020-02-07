import React from 'react'
import { connectWithRedux } from '_redux/media-settings'
import { ClassTranscribeHeader } from 'components'
import Tabs from './Tabs'
import './index.scss'

import { api } from 'utils'

function MSPHeaderWithRedux({
  tab,
  media,
}) {
  const { mediaName } = api.parseMedia(media)
  return (
    <div className="msp-header">
      <ClassTranscribeHeader bordered
        fixed={false}
        subtitle="Media Settings"
        leftElem={
          <Tabs currTab={tab} />
        }
      />
      
      <div className="msp-sub-h">
        <div>{mediaName}</div>
      </div>
    </div>
  )
}

export const MSPHeader = connectWithRedux(
  MSPHeaderWithRedux,
  [
    'tab',
    'media'
  ],
  []
)
