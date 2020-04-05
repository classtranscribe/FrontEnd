import _ from 'lodash'
import React from 'react'
import { Button } from 'pico-ui'
import { 
  connectWithRedux,
  setup,
  mediaControl, 
  plControl, 
  ORD_T_MEDIA, 
} from '../../Utils'


function ButtonBar({
  playlist,
  results=[],
  isSelectingVideos=false,
  selectedVideos=[],
  filtering=false,
  setFiltering,
  upload=false,
  onOpenUpload,
}) {

  const handleSelectAll = () => {
    mediaControl.selectAll(results)
  }

  const handleDeleteVideos = () => {
    setup.confirm({
      text: <>Are you sure to delete the selected videos?</>,
      onConfirm: () => mediaControl.handleDeleteVideos()
    })
  }

  const handleOpenSelect = () => {
    mediaControl.openSelect()
  }

  const handleCancelSelect = () => {
    mediaControl.closeSelect()
  }

  const orderMedias = () => {
    setup.orderList({
      type: ORD_T_MEDIA,
      name: 'Videos',
      items: playlist.medias,
      icon: 'play_circle_filled',
      onSave: plControl.reorderMedias
    })
  }

  const selectedAll = mediaControl.isSelectedAll(results, selectedVideos)

  return (
    <div className="w-100 ip-p-btns mt-1">
      <div className="w-100 ct-btn-group ct-d-r-center-v ip-p-btns-con">
      {
        isSelectingVideos
        ?
        <div className="ct-btn-group ct-d-r-center-v">
          <Button.Group>
            <Button uppercase
              icon={selectedAll ? "check_box" : "check_box_outline_blank"}
              color="yellow"
              text="Select All"
              onClick={handleSelectAll}
            />
            <Button uppercase
              icon="delete"
              color="red transparent"
              text="Delete"
              disabled={mediaControl.selectedVideosLength() === 0}
              onClick={handleDeleteVideos}
            />
            <Button uppercase
              icon={filtering ? "close" : "search"}
              text="Filter Videos"
              color={filtering ? "" : "transparent"}
              onClick={() => setFiltering(!filtering)}
            />
            <Button uppercase
              text="Cancel"
              color="transparent"
              onClick={handleCancelSelect}
            />
          </Button.Group>
        </div>
        :
        <div className="ct-btn-group ct-d-r-center-v">
          {
            upload
            &&
            <Button uppercase
              classNames="mr-2"
              icon="publish"
              text="upload videos"
              color="teal"
              onClick={onOpenUpload}
            />
          }
          {
            (playlist && playlist.medias && playlist.medias.length > 0)
            &&
            <>
              <Button uppercase
                icon="check_box_outline_blank"
                text="Select"
                color="transparent"
                onClick={handleOpenSelect}
              />
              <Button uppercase
                icon="format_list_numbered"
                text="order videos"
                color="transparent"
                onClick={orderMedias}
              />
              <Button uppercase
                icon={filtering ? "close" : "search"}
                text="Filter Videos"
                color={filtering ? "" : "transparent"}
                onClick={() => setFiltering(!filtering)}
              />
            </>
          }
        </div>
      }
      </div>
    </div>
  )
}

export default connectWithRedux(
  ButtonBar,
  ['isSelectingVideos', 'selectedVideos', 'playlist'],
  []
)