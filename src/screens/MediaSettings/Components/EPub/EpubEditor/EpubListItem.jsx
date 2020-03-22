import React from 'react'
import { api } from 'utils'
import { Button } from 'pico-ui'

export default function EpubListItem({
  item
}) {
  return (
    <div className="ee-el-item ct-d-c">
      <div className="ct-d-r ee-el-i-info">
        <div className="ee-el-i-img">
          <img src={api.getMediaFullPath(item.image)} alt="screenshot" />
        </div>
        <div className="ee-el-i-text">{item.text}</div>
      </div>

      <div className="ee-el-i-actions">
        <Button uppercase
          classNames="ee-el-i-split-btn"
          text="Split Chapter Here"
          color="teal transparent"
          icon="unfold_more"
        />
      </div>
    </div>
  )
}
