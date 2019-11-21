import React from 'react'
import _ from 'lodash'

import { Placeholder } from 'semantic-ui-react'
export function VideoCardPlaceHolder({ row=1, posterSize }) {
  return _.times(row, num => (
    <div className="video-card-container-row" key={`video-card-placeholder-${num}`}>
      <div className="video-card">
        <Placeholder id="img-holder">
          <Placeholder.Image style={{posterSize}}/>
        </Placeholder>
        <Placeholder id="line-holder"></Placeholder>
      </div>
    </div>
  ))
}