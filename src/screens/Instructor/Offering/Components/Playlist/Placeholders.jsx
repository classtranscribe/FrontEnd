import React from 'react'
import _ from "lodash"
import { Placeholder, List } from 'semantic-ui-react'

export function HeaderPlaceholder() {
  return (
    <div className="pl-header-placeholder">
      <Placeholder className="type-icon" >
        <Placeholder.Image />
      </Placeholder>
      <Placeholder className="name">
        <Placeholder.Image />
      </Placeholder>
    </div>
  )
}

export function VideoListPlaceHolder() {
  return (
    <>
      {
        _.times(7, num => (
          <List.Item className="vcard-placeholder" key={`video-card-placeholder-${num}`}>
            <Placeholder className="img" >
              <Placeholder.Image />
            </Placeholder>
            <Placeholder className="vname" >
              <Placeholder.Image />
              <Placeholder.Image />
            </Placeholder>
          </List.Item>
        ))
      }
    </>
  )
}