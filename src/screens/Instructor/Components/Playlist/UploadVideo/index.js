import React, { useState } from 'react'
import _ from 'lodash'
import './index.css'
import UploadButton from './UploadButton'
import {
  mediaControl,
  fileSizeParser
} from '../../../Utils'
import { CTButton } from 'components'

const FINISHED_INDEX = -1

function UploadVideo({
  playlist,
  onClose,
}) {

  const [uploadedMedias, setUploadedMedias] = useState([])
  const [uploadingIndex, setUploadingIndex] = useState(-2)
  const [progress, setProgress] = useState(0)

  const addMedia = (video1, video2) => {
    setUploadedMedias([ ...uploadedMedias, { video1, video2 } ])
  }

  const handleRemove = me => () => {
    _.remove(uploadedMedias, m => m === me)
    setUploadedMedias([ ...uploadedMedias ])
  }

  const handleSwap = index => () => {
    let temp = uploadedMedias[index].video1
    uploadedMedias[index].video1 = uploadedMedias[index].video2
    uploadedMedias[index].video2 = temp
    setUploadedMedias([ ...uploadedMedias ])
  }

  const onUploadProgress = progressEvent => {
    let percentCompleted = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
    setProgress(percentCompleted)
  }

  const handleUpload = async () => {
    await mediaControl.handleUpload(
      playlist.id, 
      uploadedMedias, 
      setUploadingIndex, 
      setProgress,
      onUploadProgress
    )

    onClose()
  }

  const isUploadingMedias = Boolean(uploadingIndex >= 0)
  const finishedUploading = uploadingIndex === FINISHED_INDEX

  return (
    <>
    {isUploadingMedias && <div className="ip-p-up-loading-wrapper"></div>}
    <div className="ip-edit-c-con ct-a-fade-in ip-edit-p-con ip-p-up-con">
      <div className="w-100 h-auto ct-a-fade-in">
        <button className="plain-btn" onClick={onClose} aria-label="go back" disabled={isUploadingMedias}>
          <h3 aria-hidden="true" tabIndex="-1" className="ip-p-pl-name ct-d-r-center-v ct-a-fade-in">
            <i className="material-icons ip-p-up-back-icon">chevron_left</i> <span>GO BACK</span>
          </h3>
        </button>

        <div className="ip-f-section">
          <div className="ip-f-title">
            <h3>Upload Videos</h3>
          </div>

          <div className="ip-f-p-types-con">
            <h4>UPLOADING GUIDE</h4>
            <div className="ip-f-p-types-t">You can either upload one video or a pair of videos for each media.</div>
            <div className="ip-f-p-types-d"> <i className="material-icons">info</i> The pair of videos will be presented to viewers with synchronized playbacks.</div>
          </div>

          <UploadButton 
            addMedia={addMedia} 
            disabled={isUploadingMedias} 
          />
        </div>

        <div className="ip-p-up-tb">
          <table>
            <col width="5%" />
            <col width="43%" />
            <col width="43%" />
            <col width="9%" />
            <tbody>
              <tr>
                <th> </th>
                <th>Video 1 <span>Primary</span></th>
                <th>Video 2</th>
                <th> </th>
              </tr>
              {uploadedMedias.map( (me, index) => (
                <tr className="v-content" key={`upload-media-${index}`}>
                  <td className="v-index"><i className="fas fa-file-video"></i></td>
                  <td className="v-name">
                    <span className="name">{me.video1.name}</span>
                    <span className="size">{fileSizeParser(me.video1.size)}</span>
                  </td>
                  <td className="v-name">
                    <span className={"name" + (me.video2 ? '' : ' empty')}>{me.video2 ? me.video2.name : 'None'}</span>
                    <span className="size">{me.video2 ? fileSizeParser(me.video2.size) : ''}</span>
                  </td>
                  <td className="v-actions">
                    {
                      uploadingIndex === index // is uploading this media
                      ?
                      <>
                        <div className="v-prog-1"></div>
                        <div className="v-prog-2" style={{width: `${80*progress / 100}px`}}></div>
                        <div className="v-prog-num">{progress}%</div>
                      </>
                      :
                      uploadingIndex > index // finished uploading 
                      ?
                      <span className="v-prog-num">Done!</span>
                      :
                      isUploadingMedias //  waiting for uploading
                      ?
                      <span className="v-prog-num">Waiting</span>
                      :
                      <> 
                        <button 
                          className="plain-btn v-a-btn" 
                          disabled={!Boolean(me.video2)}
                          onClick={handleSwap(index)} 
                        >
                          <span tabIndex="-1">
                            <i className="material-icons">swap_horiz</i>
                          </span>
                        </button>
                        <button className="plain-btn v-a-btn" onClick={handleRemove(me)}>
                          <span tabIndex="-1">
                            <i className="material-icons">delete</i>
                          </span>
                        </button>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {
          uploadedMedias.length > 0
          &&
          <div className="ct-d-r-center-h mt-5 pt-5">
            <CTButton 
              text="Upload All"
              color="green"
              size="big"
              onClick={handleUpload}
              disabled={isUploadingMedias} 
            />
          </div>
        }
      </div>
    </div>
    </>
  )
}

export default UploadVideo