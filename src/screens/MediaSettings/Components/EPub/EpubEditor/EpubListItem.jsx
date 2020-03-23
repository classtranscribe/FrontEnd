import React from 'react'
import { api } from 'utils'
import { Button } from 'pico-ui'

export default function EpubListItem({
  item,
  itemIndex,
  chapterIndex,
  splitChapter,
  magnifyImage,
  endMagnifyImage,
}) {
  return (
    <div className="ee-el-item ct-d-c">
      <div className="ct-d-r ee-el-i-info">
        <div className="ee-el-i-img">
          <img 
            src={api.getMediaFullPath(item.image)} alt="screenshot"   
            onMouseEnter={() => magnifyImage(api.getMediaFullPath(item.image))}
            onMouseLeave={endMagnifyImage}
          />
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
          onClick={() => splitChapter(chapterIndex, itemIndex)}
        />
      </div>
    </div>
  )
}
