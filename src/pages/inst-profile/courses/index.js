import React from 'react'
import { Route, Link } from 'react-router-dom'
// UIs
import { Grid, Tab, Button } from 'semantic-ui-react'
import OfferinfList from './offerings'
import NewOfferingPage from '../../offering-editing'
// Vars
// import { user } from '../../../util'

export default function Courses(props) {
  const { courses } = props.state;

  const panes = [];
  courses.forEach( course => {
    panes.push({
      menuItem: course.department.acronym + course.courseNumber,
      render: () => (
        <div style={{marginLeft: '-2rem'}}>
          <OfferinfList 
            course={course}
            onSort={props.onSort}
            sortDown={props.state.sortDown} 
          />
          {/* {course.courseName} */}
        </div>
      )
    })
  })
  
  return (
    <div className="ip-content">
      <Route path='/instructor/offering-setting/:type?=:id' component={NewOfferingPage} />
      <Title {...props}/>
      {
        courses.length ? 
        <Tab 
          menu={{ fluid: true, vertical: true, tabular: true, borderless: true }} 
          panes={panes} 
        /> : <EmptyResult {...props}/>
      }
    </div>
  )
}

function Title(props) {
  const { userId } = props.state;
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
          <Button 
            as={Link}
            to={`/instructor/offering-setting/new=${userId}`}
            variant="secondary" 
            style={{marginRight:'-2rem'}}
          >
            <i class="fas fa-plus"></i>&ensp;New Offering
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

function EmptyResult(props) {
  const { userId } = props.state;
  return (
    <div className="empty">
      <div>
        <h2>WELCOME TO</h2>
        <h1>CLASS TRANSCRIBE</h1>
      </div>
      <Button 
        as={Link}
        to={`/instructor/offering-setting/new=${userId}`}
        style={{width: 'max-content', marginTop: '1rem'}} 
        size='big' secondary
      >
        Create Your First Offering HERE!
      </Button>
    </div>
  )
}