import React from 'react'
import { 
  Grid, Segment,
  Tab as UITab, 
  Card as UICard,
  Button as UIButton, 
  Dropdown as UIDropdown,
  Divider, Popup as UIPopup,
} from 'semantic-ui-react'
import { sortFunc } from '../../util';

function OfferinfList(props) {
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
    <UITab.Pane className="sp-pane">
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

function Courses(props) {
  const instructor = props.instructor;
  const courses = instructor.courses;

  function Title() {
    return (
      <Grid>
        <Grid.Row columns={3} verticalAlign="middle">
          <Grid.Column width={4}>
            <p className="title-courses"><i class="fas fa-book"></i>&ensp;</p>
          </Grid.Column>
          <Grid.Column largeScreen={6} tablet={6} mobile={6}>
            <p className="title-offerings"><i class="fas fa-stream"></i>&ensp;</p>
          </Grid.Column>
          <Grid.Column stretched className="new-course-btn">
            <UIButton variant="secondary" onClick={props.newCourse} style={{marginRight:'-2rem'}}>
              <i class="fas fa-plus"></i>&ensp;New Course
            </UIButton>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  function EmptyResult() {
    return (
      <div className="empty">
        <div>
          <h2>WELCOME TO</h2>
          <h1>CLASS TRANSCRIBE</h1>
        </div>
        <UIButton 
          onClick={props.newCourse} 
          style={{width: 'max-content', marginTop: '1rem'}} 
          size='big' secondary
        >
          Create Your First Course HERE!
        </UIButton>
      </div>
    )
  }

  function getPanes() {
    const panes = [];
    if (!courses) return [{ 
      menuItem: 'none', 
      render: ()=> (
        <UITab.Pane className="sp-pane">
          Create your first course<br/><br/>
          <UIButton onClick={props.newCourse}>
            <i class="fas fa-plus"></i>&ensp;New Course
          </UIButton>
        </UITab.Pane>
    )}];
    for (var i = 0; i < courses.length; i++) {
      const course = courses[i];
      panes.push({
        menuItem: course.num,
        render: () => (
          <OfferinfList 
            course={course}
            newOffering={props.newOffering} 
            sortDown={props.sortDown} onSort={props.onSort}
            deleteCourse={props.deleteCourse}
            editCourse={props.editCourse}
          />)
      })
    }
    return panes;
  }

  const panes = getPanes();
  return (
    <Segment className="ip-content" loading={props.loading}>
      <Title />
      {courses.length ? 
        <UITab 
          onTabChange={(event, data) => props.setCurrCourse(data)}
          menu={{ fluid: true, vertical: true, tabular: true }} 
          panes={panes} 
        /> : <EmptyResult />
      }
    </Segment>
  )
}

export default Courses;