import React from 'react'
import { api } from 'utils'
import { Button } from 'pico-ui'
import { epub } from 'screens/MediaSettings/Utils'

export default function EpubListItem({
  item,
  itemIndex,
  chapterIndex,
}) {
  return (
    <div className="ee-el-item ct-d-c">
      <div className="ct-d-r ee-el-i-info">
        <div 
          className="ee-el-i-img"
          tabIndex="0"
          onMouseEnter={() => epub.magnifyImage(api.getMediaFullPath(item.image))}
          onMouseLeave={() => epub.endMagnifyImage}
          onFocus={() => epub.magnifyImage(api.getMediaFullPath(item.image))}
          onBlur={() => epub.endMagnifyImage}
        >
          <img src={api.getMediaFullPath(item.image)} alt="screenshot" />
        </div>
        <div className="ee-el-i-text">
          {
            item.text 
            ||
            <span className="text-muted"><i>No Transcriptions</i></span>
          }
        </div>
      </div>

      <div className="ee-el-i-actions">
        <Button uppercase
          classNames="ee-el-i-split-btn"
          text="Split Chapter Here"
          color="teal transparent"
          icon="unfold_more"
          onClick={() => epub.splitChapter(chapterIndex, itemIndex)}
        />
      </div>
    </div>
  )
}
