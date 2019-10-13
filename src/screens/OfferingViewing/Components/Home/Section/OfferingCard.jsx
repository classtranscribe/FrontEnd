import React from 'react'
import { Link } from 'react-router-dom'
// UI
import { Card } from 'react-bootstrap'
import { StarredButton } from './Overlays'
import './index.css'
// Vars
import { handleData, search, util, user } from 'utils'
import { offeringPosterImg as imgHolder } from 'images'

export default function OfferingCard({ offering, starredOfferings, depart={}, termSelected=[], image=false, ...functions }) {
  // if the full offering data has not yet loaded
  if (!offering.courses || offering.isTestCourse) return null
  if (termSelected.length && !handleData.includes(termSelected, offering.offering.termId)) return null;
  // if loaded set the fullCourse
  const course = {...offering.courses[0]}
  var fullCourse = {
    ...course, 
    key: offering.id || offering.offering.id,
    id: offering.id || offering.offering.id,
    courseNumber: depart.acronym + course.courseNumber,
    fullNumber: search.getFullNumber(offering.courses),
    termName: offering.offering.termName,
    section: offering.offering.sectionName,
    accessType: offering.offering.accessType,
  }

  const isLoggedIn = user.isLoggedIn()

  return !fullCourse ? null :
    <div className="offering-card-container">
      {
        isLoggedIn
        && 
        <StarredButton 
          {...functions}
          position={image ? 'middle' : 'top'}
          offeringId={fullCourse.id}
          starredOfferings={starredOfferings}
        />
      }
      <Card 
        className={`offeringCard ${image ? 'image-card' : 'basic-card'}`} as={Link} 
        to={{
          pathname: util.links.offeringDetail(fullCourse.id),
          state: { hash: fullCourse.acronym, from: 'home', fullCourse: fullCourse }
        }}
        //title={`${fullCourse.courseNumber} ${fullCourse.courseName}`}
        aria-describedby={"offering-info-" + fullCourse.id}
      >
        {
          image
          &&
          <Card.Img 
            className="img" variant="top" 
            src={imgHolder} style={{pointerEvents: 'none'}}
            alt=""
          />
        }
        <p id={"offering-info-" + fullCourse.id} className="accessbility_hide">{fullCourse.courseNumber + ' ' + fullCourse.courseName + ' ' + fullCourse.termName + ' ' + fullCourse.section}</p>
        <Card.Body>
          <Card.Title className="title">
            <p>{fullCourse.fullNumber} </p>{fullCourse.courseName}
          </Card.Title>
          <Card.Text className="info">
            {fullCourse.termName} - {fullCourse.section}
          </Card.Text>
          <Card.Text className="description">
            {fullCourse.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
}