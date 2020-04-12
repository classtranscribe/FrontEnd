import React, { useState } from 'react'
import { Button } from 'pico-ui'
import { epub, NO_EPUB } from '../../Utils'

export default function RequestEpub({
  mediaId
}) {
  const [requested, setRequested] = useState(0)

  const handleRequest = async () => {
    setRequested(1)
    await epub.requestEpub(mediaId)
    setRequested(2)
  }

  return (
    <div className="msp-ee-con ct-a-fade-in">
      <div className="msp-ee w-100 ct-d-c-center" data-column data-scroll>
        <div className="ee-request-epub-text">
          {
            !requested
            ?
            'There is no ePub data for this media currently.'
            :
            <div className="ct-d-c-center">
              <div className="mt-5">
                <div className="sk-wave">
                  <div className="sk-wave-rect"></div>
                  <div className="sk-wave-rect"></div>
                  <div className="sk-wave-rect"></div>
                  <div className="sk-wave-rect"></div>
                  <div className="sk-wave-rect"></div>
                </div>
              </div>
              {'Request has been sent successfully.\nThe file is processing right now, please check it later.'}
            </div>
          }
        </div>
        <Button round 
          size="big"
          color="teal" 
          classNames="ee-act-btn"
          loading={requested === 1}
          disabled={requested === 2}
          onClick={handleRequest}
        >
          Request a ePub now
        </Button>
      </div>
    </div>
  )
}
