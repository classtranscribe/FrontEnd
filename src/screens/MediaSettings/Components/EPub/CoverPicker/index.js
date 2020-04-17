import React, { useState } from 'react'
import { CTModal } from 'components'
import { api } from 'utils'
import { epub } from 'screens/MediaSettings/Utils'
import './index.scss'

export default function CoverPicker({
  currChapter,
  images=[],
}) {

  const [cover, setCover] = useState(currChapter.image)

  const onPick = image => () => {
    setCover(image)
  }

  const onSave = () => {
    epub.saveCoverImage(cover)
  }

  return (
    <CTModal large
      show={true}
      title="Choose cover image"
      saveBtnText="Save cover image"
      onSave={onSave}
      onClose={() => epub.closeCoverImagePicker()}
    >
      <h3>Screenshots</h3>
      <div className="msp-ee-cp-con">
        <div className="ee-cp-imgs" data-scroll>
          {images.map(imageSrc => (
            <div 
              key={imageSrc} 
              tabIndex={0}
              className="ee-cp-img-con"
              data-current={imageSrc === cover}
              onClick={onPick(imageSrc)}
            >
              <img src={api.getMediaFullPath(imageSrc)} alt="Cover Image" />
              <div className="ee-cp-img-wrapper ct-d-r-center">
                {
                  imageSrc === cover
                  &&
                  <i className="material-icons">check_circle</i>
                }
              </div>
            </div>
          ))}
        </div>
        <div className="ee-cp-cover">
          <img src={api.getMediaFullPath(cover)} alt="Selected Cover Image" />
        </div>
      </div>
    </CTModal>
  )
}
