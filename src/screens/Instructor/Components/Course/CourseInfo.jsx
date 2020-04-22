import React, { useState } from 'react'
import { Button } from 'pico-ui'
import { Sticky } from 'semantic-ui-react'

export default function CourseInfo({
  offering,
  stickyContextRef=null,
  handleEdit,
  handleDelete,
  viewAnalytics,
}) {

  const [isTop, setIsTop] = useState(true)

  return (
    <>
      <Sticky pushing
        offset={53}
        context={stickyContextRef}  
        onStick={() => setIsTop(false)} 
        onUnstick={() => setIsTop(true)}
      >
        <div className={"ip-course-info-1 ip-sticky-top" + (isTop ? '' : ' sticking')}>
          <h2 className="ip-c-num">{offering.courseNumber}</h2>
        </div>
      </Sticky>

      <div className="ip-course-info">
        <div className="ip-c-name">{offering.courseName}</div>
        <div className="ip-c-detail">
          {offering.term.name} | {offering.sectionName}
        </div>
        {
          offering.description
          &&
          <div className="ip-c-descrip">
            {
              offering.description.slice(0,200) === offering.description 
              ? offering.description
              : offering.description.slice(0,200) + ' ...'
            }
          </div>
        }

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
              color="black"
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