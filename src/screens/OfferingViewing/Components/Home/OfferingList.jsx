import React from 'react'
import { Header } from 'semantic-ui-react'
import { Card } from 'react-bootstrap';
import { handleData, search } from '../../../../util';
import { OfferingCardHolder } from './PlaceHolder'

export default function OfferingList({state, setCurrentOffering}) {
  const { departments, departSelected, offerings } = state
  const showAll = !departSelected.length

  function isSelected(depart) {
    return handleData.includes(departSelected, depart.id)
  }
  function notEmpty(depart) {
    // if (!offerings.courses) return false;
    for (let i = 0; i < offerings.length; i++) {
      if (handleData.find(offerings[i].courses, {departmentId: depart.id})) return true;
    }
    return false
  }
  return (
    <div className="offering-list" role="list">
      <div>
        {departments.map( depart => (showAll || isSelected(depart)) && (notEmpty(depart)) ? (
          <Section 
            state={state} 
            depart={depart} key={depart.id} 
            setCurrentOffering={setCurrentOffering} 
          />
        ) : <></>)}
      </div>
    </div>
  )
}


function Section({depart, state, setCurrentOffering}) {
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
            setCurrentOffering={setCurrentOffering}
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

function SectionItem({offering, depart, terms, termSelected, setCurrentOffering}) {
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
        fullNumber: search.getFullNumber(offering.courses),
        term: !terms[0] ? {name: ''} : term ? term : {name: ''},
        section: offering.offering.sectionName
      }
    }
    // console.log(fullCourse)
  })

  return fullCourse ? (
    <Card className="offeringCard" key={offering.offering.id} onClick={() => setCurrentOffering(fullCourse)}>
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