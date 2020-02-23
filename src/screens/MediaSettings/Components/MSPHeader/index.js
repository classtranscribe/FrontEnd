import React from 'react'
import { connectWithRedux } from '../../Utils'
import { Popup } from 'semantic-ui-react'
import { ClassTranscribeHeader } from '../../../../components'
import Tabs from './Tabs'
import './index.scss'


function MSPHeaderWithRedux({
  tab,
  media,
}) {
  const { mediaName } = media

  return (
    <div className="msp-header">
      <ClassTranscribeHeader //bordered
        fixed={false}
        subtitle="Media Settings"
        //leftElem={}
      />
      
      <div className="msp-sub-h">
        <div className="msp-me-info">
          <Popup inverted
            openOnTriggerFocus
            closeOnTriggerBlur
            content={
              <div><strong>{mediaName}</strong></div>
            }
            trigger={
              <div tabIndex={0} className="msp-me-name">
                {mediaName}
              </div>
            }
          />
        </div>
        <Tabs currTab={tab} />
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
