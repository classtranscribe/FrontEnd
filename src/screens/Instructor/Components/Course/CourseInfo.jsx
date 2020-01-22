import React from 'react'
import { CTButton } from 'components'
import { OFF_ANALYSIS } from '../../Utils'

export default function CourseInfo({
  offering,
  playlist,

  handleEdit,
  handleDelete,
  handlePlaylistClick,
}) {
  return (
    <>
      <div className="ip-course-info-1">
        <h2 className="ip-c-num">{offering.courseNumber}</h2>
      </div>

      <div className="ip-course-info">
        <div className="ip-c-name">{offering.courseName}</div>
        <div className="ip-c-detail">
          {offering.term.name} | {offering.sectionName}
        </div>
        <div className="ip-c-descrip">
          {offering.description}
        </div>

        <div className="ip-c-btns-con ct-btn-group">
          <CTButton
            text="Edit Course"
            icon="edit"
            color="green"
            onClick={handleEdit}
          />
          <CTButton
            icon="delete"
            color="light"
            popup="Delete Course"
            onClick={handleDelete}
            //popupDelay={500}
          />
        </div>
      </div>

      <div className="w-100 mb-3">
        <button 
          className="plain-btn ip-sb-off-item ip-c-pl-item" 
          data-current={playlist === OFF_ANALYSIS}
          onClick={handlePlaylistClick(OFF_ANALYSIS)}
        >
          <div tabIndex="-1" className="ip-sb-off-item-con ip-c-pl-item-con">
            <span className="ct-d-r-center-v ip-sb-off-text ip-c-pl-name ip-sb-off-num">
              <i className="material-icons" aria-hidden="true">bar_chart</i> COURSE ANALYSIS
            </span>
            <span className="ip-c-pl-r-icon" data-small>
              <i className="material-icons">chevron_right</i>
            </span>
          </div>
        </button>
      </div>
    </>
  )
}