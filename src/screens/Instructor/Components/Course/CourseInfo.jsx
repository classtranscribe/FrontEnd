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
          <Button.Group>
            {
              offering.logEventsFlag 
              &&
              <Button uppercase
                text="Analytics"
                icon="bar_chart"
                color="primary teal"
                onClick={viewAnalytics}
              />
            }
            <Button uppercase
              text="Settings"
              icon="settings"
              //color="transparent black"
              onClick={handleEdit}
            />
            <Button round
              icon="delete"
              color="transparent"
              popup="Delete Course"
              onClick={handleDelete}
            />
          </Button.Group>
        </div>
      </div>
    </>
  )
}