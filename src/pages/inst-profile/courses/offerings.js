import React from 'react'
import { Grid, Tab, Card, Button, Divider, Popup, Message } from 'semantic-ui-react'
import { sortFunc } from '../../../util';

export default function OfferinfList(props) {
  const course = props.course;
  const sortBy = props.sortDown ? sortFunc.sortDownByTerm : sortFunc.sortUpByTerm;
  const offerings = course.offerings.slice().sort(sortBy);
  return (
    <Tab.Pane className="sp-pane" style={{background: 'none'}}>
      <CourseInfoCard {...props}/>
      <OfferingTitle {...props}/>
      <div style={{width: '100%'}}>
        {offerings.map( offering => (
          <Message 
            fluid key={offering.term+offering.sectionName} // should be offering.id 
            className='offering-listitem'
            onClick={()=>window.location='/offering/0'}
          >
            <Grid celled='internally'>
              <Grid.Row className="offering-info">
                <Grid.Column className="course-num" width={3}>
                  <h3>{course.department.acronym + course.courseNumber}</h3>
                </Grid.Column>
                <Grid.Column width={5}><strong>{offering.term}</strong></Grid.Column>
                <Grid.Column width={5}><strong>{offering.sec}&ensp;</strong></Grid.Column>
              </Grid.Row>
            </Grid>
          </Message>
        ))}
      </div>
    </Tab.Pane>
  )
}

function CourseInfoCard(props) {
  const course = props.course;
  const cardStyle = {width: '100%', textAlign: 'left', }
  return (
    <Card className="course-info" fluid>
      <Card.Content style={cardStyle}>
        <h2>{course.department.acronym + course.courseNumber}&ensp;</h2>
        <h5>{course.courseName}</h5>

        <Divider />          
        <p><strong>Department: </strong>{course.department.name}</p>
        <p><strong>Description: </strong>{course.description}</p>
      </Card.Content>
    </Card>
  )
}

function OfferingTitle(props) {
  const iconName = props.sortDown ? "sort up" : "sort down";
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
              <Button onClick={props.onSort} icon={iconName} compact size="mini"/>
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

// function NoOfferingWrapper(props) {
//   return (
//     <div className="no-offering">
//       <Button secondary size="huge" onClick={props.newOffering} >
//         Create Your First Offering HERE
//       </Button>
//     </div>
//   )
// }