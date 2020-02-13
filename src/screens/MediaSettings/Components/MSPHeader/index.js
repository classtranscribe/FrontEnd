import React from 'react'
import { connectWithRedux } from '../../../../_redux/media-settings'
import { Sticky } from 'semantic-ui-react'
import { ClassTranscribeHeader } from '../../../../components'
import './index.scss'

function MSPHeaderWithRedux({
  tab,
  contextRef
}) {
  return (
    <div className="msp-header">
      <ClassTranscribeHeader 
        leftElem={
          <div>123</div>
        }
      />
    </div>
  )
}

export const MSPHeader = connectWithRedux(
  MSPHeaderWithRedux,
  ['tab'],
  []
)
