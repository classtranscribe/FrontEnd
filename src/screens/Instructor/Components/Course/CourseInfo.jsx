import React from 'react'
import { Button } from 'pico-ui'

export default function CourseInfo({
  offering,

  handleEdit,
  handleDelete,
  viewAnalytics,
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
          <Button uppercase
            text="Edit Course"
            color="transparent teal"
            onClick={handleEdit}
          />
          <Button round
            icon="delete"
            color="transparent"
            popup="Delete Course"
            onClick={handleDelete}
          />
        </div>
      </div>

      {
        offering.logEventsFlag 
        &&
        <div className="w-100 mb-3">
          <button 
            className="plain-btn ip-sb-off-item ip-c-pl-item" 
            onClick={viewAnalytics}
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
      }
    </>
  )
}