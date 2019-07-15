import React from 'react'
import { Link } from 'react-router-dom'
// UI
import { Header } from 'semantic-ui-react'
import { Card } from 'react-bootstrap'
import { OfferingCardHolder, OfferingListHolder } from './PlaceHolder'
// Vars
import { handleData, search } from '../../../../util'
const imgHolder = require('../../../../images/Video-Placeholder.jpg')


export default function OfferingList({state, setCurrentOffering}) {
  const { departments, departSelected, offerings } = state
  if (!departments.length || !offerings.length || !offerings[1].courses) return <OfferingListHolder />
  const showAll = !departSelected.length

  function isSelected(depart) {
    return handleData.includes(departSelected, depart.id)
  }

  function notEmpty(depart) {
    for (let i = 0; i < offerings.length; i++) {
      const hasOfferings = handleData.find(offerings[i].courses, {departmentId: depart.id})
      if (hasOfferings) return true
    }
    return false
  }

  return (
    <div className="offering-list" role="list">
      {departments.map( depart => (showAll || isSelected(depart)) && (notEmpty(depart)) ? (
        <Section 
          state={state} 
          depart={depart} key={depart.id} 
          setCurrentOffering={setCurrentOffering} 
        />
      ) : null)}
    </div>
  )
}


function Section({depart, state, setCurrentOffering}) {
  const { offerings, universities } = state
  const uni = universities.length ? handleData.findById(universities, depart.universityId) : ''
  const getKey = (offering, index) => depart.id + (offering.id || offering.offering.id) + index
  return (
    <div className="section" role="listitem" id={depart.acronym}>
      <Header className="title" as="a" href={`#${depart.acronym}`}>
        {depart.name}&emsp;<span>{uni.name}</span>
      </Header>
      <div className="offerings">
        {offerings.map( (offering, index) => 
          offering.courses ? 
          <SectionItem 
            {...state}
            key={getKey(offering, index)}
            offering={offering} depart={depart}  
            setCurrentOffering={setCurrentOffering}
          />
          : 
          <OfferingCardHolder key={getKey(offering, index)} />
        )}
      </div>
    </div>
  )
}

function SectionItem({offering, depart, termSelected, setCurrentOffering}) {
  // if the full offering data has not yet loaded
  if (!offering.courses) return null
  if (termSelected.length && !handleData.includes(termSelected, offering.offering.termId)) return null;
  // if loaded set the fullCourse
  var fullCourse = null
  offering.courses.forEach(course => {
    if (course.departmentId === depart.id) {
      fullCourse = {
        ...course, 
        key: offering.id || offering.offering.id,
        courseNumber: depart.acronym + course.courseNumber,
        fullNumber: search.getFullNumber(offering.courses),
        termName: offering.offering.termName,
        section: offering.offering.sectionName,
      }
    }
    // console.log(fullCourse)
  })

  return fullCourse ? 
    <Card className="offeringCard" as={Link} onClick={() => setCurrentOffering(fullCourse)}>
      <Card.Img 
        className="img" variant="top" 
        src={imgHolder} style={{pointerEvents: 'none'}}
      />
      <Card.Body>
        <Card.Title className="title">
          {fullCourse.courseNumber}&ensp;{fullCourse.courseName}
        </Card.Title>
        <Card.Text className="info">
          {fullCourse.termName}&ensp;(Sec {fullCourse.section})
        </Card.Text>
        <Card.Text className="description">
          {fullCourse.description}
        </Card.Text>
      </Card.Body>
    </Card>
    : 
    null
}