import React from 'react'
import { useHistory } from 'react-router'
import { Button } from 'pico-ui'

import { mediaControl, setup } from '../../../Utils'
import { util } from '../../../../../utils'

function InlineButtons({
  isUnavailable=false,
  mediaName='',
  media,
  show=false,

  handleRename,
}) {

  const history = useHistory()
  const handleWatch = () => {
    let pathname = util.links.watch(media.id)
    history.push(pathname)
  }

  const handleDelete = async () => {
    await mediaControl.deleteMedia(media)
  }

  const confirmDeletion = () => {
    setup.confirm({
      text: <div>Are you sure to delete the video <span>{mediaName}</span> ?</div>,
      onConfirm: handleDelete
    })
  }

  return show ? (
    <div className="ip-video-opts ct-btn-group">
      <Button round compact
        classNames="ip-v-w-btn"
        popup={isUnavailable ? "" : 'Watch'}
        icon="play_circle_filled"
        color="transparent"
        onClick={handleWatch}
        disabled={isUnavailable}
      />

      <Button round compact
        popup="Rename"
        icon="edit"
        color="light"
        color="transparent"
        onClick={handleRename}
      />

      <Button round compact
        popup="Delete"
        icon="delete"
        color="transparent"
        onClick={confirmDeletion}
      />
    </div>
  ) : null
}

export default InlineButtons