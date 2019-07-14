import React from 'react'
import { Header } from 'semantic-ui-react'
import { Card } from 'react-bootstrap';
import { handleData } from '../../../../util';
import { OfferingCardHolder } from './PlaceHolder'

export default function OfferingList({state}) {
  const { departments, departSelected } = state
  return (
    <div className="offering-list" role="list">
      <div>
        {departments.map( depart => (!departSelected.length || handleData.includes(departSelected, depart.id)) ? (
          <Section state={state} depart={depart} key={depart.id} />
        ) : <></>)}
      </div>
    </div>
  )
}


function Section({depart, state}) {
  const { offerings, universities } = state
  const uni = universities.length ? handleData.findById(universities, depart.universityId) : ''
  return (
    <div className="section" role="listitem">
      <Header className="title">{depart.name}&emsp;<span>{uni.name}</span></Header>
      <div className="offerings">
        {offerings.map((offering, index) => 
          offering.courses ? 
          <SectionItem 
            {...state}
            offering={offering} depart={depart}  
            key={offering.offering ? offering.offering.id + index.toString() : offering.id + index.toString()}
          />
          : 
          <OfferingCardHolder />
        )}
      </div>
    </div>
  )
}

function SectionItem({offering, depart, terms, termSelected}) {
  // if the full offering data has not yet loaded
  if (!offering.courses) return null;
  if (termSelected.length && !handleData.includes(termSelected, offering.offering.termId)) return null;
  // if loaded set the fullCourse
  var fullCourse = null
  offering.courses.forEach(course => {
    if (course.departmentId === depart.id) {
      const term = handleData.findById(terms, offering.offering.termId)
      fullCourse = {
        ...course, 
        courseNumber: depart.acronym + course.courseNumber,
        term: !terms[0] ? {name: ''} : term ? term : {name: ''},
        section: offering.offering.sectionName
      }
    }
    // console.log(fullCourse)
  })

  return fullCourse ? (
    <Card className="offeringCard" key={offering.offering.id}>
      <Card.Img 
        className="img" variant="top" 
        src={require('../../../../images/Video-Placeholder.jpg')} 
      />
      <Card.Body style={{marginTop: '-0.8rem'}}>
        <Card.Title className="title">
          {fullCourse.courseNumber}&ensp;{fullCourse.courseName}
        </Card.Title>
        <Card.Text className="info">
          {fullCourse.term.name}&ensp;(Sec {fullCourse.section})
        </Card.Text>
        <Card.Text className="description">
          {fullCourse.description}
        </Card.Text>
      </Card.Body>
    </Card>
  ) : (<></>)
}