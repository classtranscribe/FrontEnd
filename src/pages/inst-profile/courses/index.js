import React from 'react'
import { Route } from 'react-router-dom'
import { 
  Grid, 
  Tab as UITab, 
  Button as UIButton, 
} from 'semantic-ui-react'
import OfferinfList from './offerings'

export default function Courses(props) {
  const { courses } = props.state;

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
          <div style={{marginLeft: '-2rem'}}>
            <OfferinfList 
              course={course}
              newOffering={props.newOffering} 
              sortDown={props.sortDown} onSort={props.onSort}
              deleteCourse={props.deleteCourse}
              editCourse={props.editCourse}
            />
          </div>
        )
      })
    }
    return panes;
  }

  const panes = getPanes();
  return (
    <div className="ip-content">
      <Title {...props}/>
      {courses.length ? 
        <UITab 
          onTabChange={(event, data) => props.setCurrCourse(data)}
          menu={{ fluid: true, vertical: true, tabular: true, borderless: true }} 
          panes={panes} 
        /> : <EmptyResult {...props}/>
      }
    </div>
  )
}

function Title(props) {
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

function EmptyResult(props) {
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