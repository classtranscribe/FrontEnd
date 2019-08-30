import React from 'react'
import _ from "lodash"
import { Link } from 'react-router-dom'
import { Placeholder, List, Button, Icon } from 'semantic-ui-react'
import { SpinnerLoader } from 'components'
import { util } from 'utils'

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

export function VideoListPlaceHolder({ isEmpty, playlist }) {
  const { id, offeringId, sourceType } = playlist || {}
  return !isEmpty ? (
    <>
      {
        _.times(5, num => (
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
  ) : sourceType === 2 ? (
    <div className="empty-upload">
      <p><Icon name="upload" />Upload your first video here</p>
      <Button as={Link} to={util.links.uploadVideo(offeringId, id)}>Browse Files</Button>
    </div>
  ) : (
    <SpinnerLoader>
      <h5>Your videos will be available soon.</h5>
      <p>Please <a href="mailto:classtranscribe@illinois.edu">contact us</a> if you have any questions.</p>
    </SpinnerLoader>
  )
}