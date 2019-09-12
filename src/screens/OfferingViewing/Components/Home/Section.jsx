import React from 'react'
import { Link } from 'react-router-dom'
// UI
import { Header } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import { OfferingCardHolder } from './PlaceHolder'
// Vars
import { handleData, search, util } from 'utils'
const imgHolder = require('images/Video-Placeholder.jpg')

function isThisSection(offering, departmentId) {
  if (handleData.find(offering.courses, { departmentId })) return true
  return false
}

export default function Section({depart, state}) {
  var { offerings, universities } = state
  const uni = universities.length ? handleData.findById(universities, depart.universityId) : ''
  const getKey = (offering, index) => depart.id + (offering.id || offering.offering.id) + index

  offerings = offerings.filter( offering => isThisSection(offering, depart.id))
  const offeringLen = offerings.length
  const halfLen = Math.floor(offerings.length / 2)
  const offerings1 = offeringLen > 13 ? offerings.slice(0, halfLen) : offerings
  const offerings2 = offerings.length > 13 ? offerings.slice(halfLen, offeringLen) : []

  return (
    <div className="section" role="listitem" id={depart.acronym}>
      <Header className="title" as="a" href={`#${depart.acronym}`}>
        {depart.name}&emsp;<span>{uni.name}</span>
      </Header>
      <div className="offerings">
        {offerings1.map( (offering, index) => 
          offering.courses ? 
          <SectionItem 
            {...state}
            key={getKey(offering, index)}
            depart={depart}  
            offering={offering} 
          />
          : 
          <OfferingCardHolder key={getKey(offering, index)} />
        )}
      </div>
      {
        offerings2.length > 0
        &&
        <div className="offerings">
          {offerings2.map( (offering, index) => 
            offering.courses ? 
            <SectionItem 
              {...state}
              key={getKey(offering, index)}
              offering={offering} depart={depart}  
            />
            : 
            <OfferingCardHolder key={getKey(offering, index)} />
          )}
        </div>
      }
    </div>
  )
}

function SectionItem({offering, depart, termSelected}) {
  // if the full offering data has not yet loaded
  if (!offering.courses || offering.isTestCourse) return null
  if (termSelected.length && !handleData.includes(termSelected, offering.offering.termId)) return null;
  // if loaded set the fullCourse
  var fullCourse = null
  const course = handleData.find(offering.courses, { departmentId: depart.id })
  if (course) {
    fullCourse = {
      ...course, 
      key: offering.id || offering.offering.id,
      courseNumber: depart.acronym + course.courseNumber,
      fullNumber: search.getFullNumber(offering.courses),
      termName: offering.offering.termName,
      section: offering.offering.sectionName,
      accessType: offering.offering.accessType,
    }
  }

  return !fullCourse ? null :
    <Card 
      className="offeringCard" as={Link} 
      to={{
        pathname: util.links.offeringDetail(fullCourse.key),
        state: { hash: fullCourse.acronym, from: 'home', fullCourse: fullCourse }
      }}
    >
      <Card.Img 
        className="img" variant="top" 
        src={imgHolder} style={{pointerEvents: 'none'}}
      />
      <Card.Body>
        <Card.Title className="title">
          {fullCourse.courseNumber}&ensp;{fullCourse.courseName}
        </Card.Title>
        <Card.Text className="info">
          {fullCourse.termName}&ensp;({fullCourse.section})
        </Card.Text>
        <Card.Text className="description">
          {fullCourse.description}
        </Card.Text>
      </Card.Body>
    </Card>
}