import _ from 'lodash'
import React from 'react'
import { connectWithRedux } from '_redux/instructor'
import { CTButton } from 'components'
import { mediaControl } from '../../Utils'

function ButtonBar({
  results=[],
  isSelectingVideos=false,
  selectedVideos=[],
}) {

  const handleSelectAll = () => {
    mediaControl.selectAll(results)
  }

  const handleDeleteVideos = () => {
    mediaControl.handleDeleteVideos()
  }

  const handleOpenSelect = () => {
    mediaControl.handleOpenSelect()
  }

  const selectedAll = mediaControl.isSelectedAll(results, selectedVideos)

  return (
    <div className="w-100 ip-p-btns">
      <div className="w-100 ct-btn-group ct-d-r-center-v ip-p-btns-con">
      {
        isSelectingVideos
        ?
        <div className="ct-btn-group ct-d-r-center-v">
          <CTButton
            size="normal bold"
            icon={selectedAll ? "close" : "check"}
            color="yellow"
            text={selectedAll ? "Remove All" : "Select All"}
            onClick={handleSelectAll}
          />
          <CTButton
            size="normal bold"
            icon="delete"
            color="red"
            text="Delete"
            disabled={mediaControl.selectedVideosLength() === 0}
            onClick={handleDeleteVideos}
          />
          <CTButton
            size="normal bold"
            text="Cancel"
            onClick={handleOpenSelect}
          />
        </div>
        :
        <div className="ct-btn-group ct-d-r-center-v">
          <CTButton
            size="normal bold"
            text="Upload"
            icon="cloud_upload"
            color="green"
          />
          <CTButton
            size="normal bold"
            text="Select"
            onClick={handleOpenSelect}
          />
        </div>
      }
      </div>
    </div>
  )
}

export default connectWithRedux(
  ButtonBar,
  ['isSelectingVideos', 'selectedVideos'],
  []
)