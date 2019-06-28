import React from 'react'
import { 
  Grid, Segment,
  Tab as UITab, 
  Card as UICard,
  Button as UIButton, 
  Dropdown as UIDropdown,
  Divider, Popup as UIPopup,
} from 'semantic-ui-react'
import { sortFunc } from '../../../util';

export default function OfferinfList(props) {
  const cardStyle = {width: '100%', textAlign: 'left', backgroundColor: 'rgb(169, 191, 192)'}
  function CourseInfoCard() {
    return (
      <UICard className="course-info" fluid>
        <UICard.Content style={cardStyle}>
          <Grid style={{marginLeft: '1rem'}}>
            <Grid.Row verticalAlign="middle">
              <Grid.Column widescreen={2} largeScreen={3} computer={4} tablet={5} mobile={7}>
                <h2>{course.num}</h2>
              </Grid.Column>
              <Grid.Column largeScreen={10} computer={10} tablet={14}>
                <h5>{course.name}</h5>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider horizontal>
            <UIPopup inverted content='Course setting' trigger={
              <UIDropdown text='' icon='setting' floating labeled button className='icon'>
                <UIDropdown.Menu>
                  <UIDropdown.Item onClick={props.editCourse} icon='edit' content="Edit Course" />
                  <UIDropdown.Item onClick={props.deleteCourse} icon='trash'content="Delete Course" />
                </UIDropdown.Menu>
              </UIDropdown>
            } />
            
          </Divider>
          
          <p><strong>Department: </strong>{course.department}</p>
          <p><strong>Description: </strong>{course.description}</p>
        </UICard.Content>
      </UICard>
    )
  }

  function OfferingTitle() {
    const iconName = props.sortDown ? "sort up" : "sort down";
    return (
      <Grid style={{width: '100%', marginLeft: '1rem'}}>
        <Grid.Row columns={4} verticalAlign="middle">
          <Grid.Column width={3}>
            <p className="subtitle-courses">Course</p>
          </Grid.Column>
          <Grid.Column width={5}>
            <p className="subtitle-offerings">
              Offering Term&ensp;
              <UIPopup inverted content='Sort offerings by term' trigger={
                <UIButton onClick={props.onSort} icon={iconName} compact size="mini" secondary />
              } />
            </p>
          </Grid.Column>
          <Grid.Column width={3}>
            <p >Section</p>
          </Grid.Column>
          <Grid.Column >
            <UIButton 
              secondary color="black" onClick={props.newOffering} className="new-offering-btn"
              style={{marginTop: '-0.5rem', marginBottom: '0.5rem', width: 'max-content'}}
            >
              <i class="fas fa-plus"></i>
            </UIButton>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  function NoOfferingWrapper() {
    return (
      <div className="no-offering">
        <UIButton secondary size="huge" onClick={props.newOffering} >
          Create Your First Offering HERE
        </UIButton>
      </div>
    )
  }

  const course = props.course;
  const sortBy = props.sortDown ? sortFunc.sortDownByTerm : sortFunc.sortUpByTerm;
  const offerings = course.offerings.slice().sort(sortBy);
  return (
    <UITab.Pane className="sp-pane" style={{background: 'none'}}>
      <CourseInfoCard />
      {offerings.length ? 
        <>
          <OfferingTitle />
          <div style={{width: '100%'}}>
            {offerings.map( offering => (
              <Segment 
                fluid raised 
                onClick={()=>window.location='/class-transcribe-frontend/#/course/0'}
              >
                <Grid celled='internally'>
                  <Grid.Row className="offering-info">
                    <Grid.Column className="course-num" width={3}><h3>{course.num}</h3></Grid.Column>
                    <Grid.Column width={5}><strong>{offering.term}</strong></Grid.Column>
                    <Grid.Column width={5}><strong>{offering.sec}&ensp;</strong></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            ))}
          </div>
        </> : <NoOfferingWrapper />
      }
    </UITab.Pane>
  )
}