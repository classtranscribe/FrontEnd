import React from 'react'
import { Grid, Tab, Card, Button, Divider, Popup, Message } from 'semantic-ui-react'
import { sortFunc, util, handleData } from '../../../util';

export default function OfferinfList({courseOffering, onSort, sortDown, terms, department}) {
  const { course, offerings } = courseOffering;
  const sortBy = sortDown ? sortFunc.sortDownByTerm : sortFunc.sortUpByTerm;
  const sortedOfferings = offerings.slice().sort(sortBy);
  return (
    <Tab.Pane className="sp-pane" style={{background: 'none'}} key={course.id}>
      <CourseInfoCard {...courseOffering} department={department}/>
      <OfferingTitle onSort={onSort} sortDown={sortDown}/>
      <div style={{width: '100%'}}>
        {sortedOfferings.map( offering => {
          const term = handleData.findById(terms, offering.termId)
          return (
            <Message 
              fluid key={offering.id} 
              className='offering-listitem'
              onClick={()=>util.toOfferingPage(offering.id)}
            >
              <Grid celled='internally'>
                <Grid.Row className="offering-info">
                  <Grid.Column className="course-num" width={3}>
                    <h3>{department.acronym + course.courseNumber}</h3>
                  </Grid.Column>
                  <Grid.Column width={5}><strong>{term ? term.name : ''}</strong></Grid.Column>
                  <Grid.Column width={5}><strong>{offering.sectionName}&ensp;</strong></Grid.Column>
                </Grid.Row>
              </Grid>
            </Message>
          )
        })}
      </div>
    </Tab.Pane>
  )
}

function CourseInfoCard({course, department}) {
  const cardStyle = {width: '100%', textAlign: 'left', }
  return (
    <Card className="course-info" fluid>
      <Card.Content style={cardStyle}>
        <h2>{department.acronym + course.courseNumber}&ensp;</h2>
        <h5>{course.courseName}</h5>

        <Divider />          
        <p><strong>Department: </strong>{department.name}</p>
        <p><strong>Description: </strong>{course.description}</p>
      </Card.Content>
    </Card>
  )
}

function OfferingTitle({sortDown, onSort}) {
  const iconName = sortDown ? "sort up" : "sort down";
  return (
    <Grid style={{width: '100%', margin: '0 0 .1rem 1rem'}}>
      <Grid.Row columns={4} verticalAlign="middle">
        <Grid.Column width={3}>
          <p className="subtitle-courses">Course</p>
        </Grid.Column>
        <Grid.Column width={5}>
          <p className="subtitle-offerings">
            Offering Term&ensp;
            <Popup inverted content='Sort offerings by term' trigger={
              <Button onClick={onSort} icon={iconName} compact size="mini"/>
            } />
          </p>
        </Grid.Column>
        <Grid.Column width={3}>
          <p >Section</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}