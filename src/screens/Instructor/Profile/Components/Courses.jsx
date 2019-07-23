/**
 * Component for Instructor Profile Page
 * - contents courses and offerings of the instructor
 * - where instructor can create a new offering
 */

import React from 'react'
import { Link } from 'react-router-dom'
// UI & Layouts
import { Grid, Tab, Button } from 'semantic-ui-react'
import OfferinfList from './OfferingList'
// Vars
import { handleData, api, util } from 'utils'

/**
 * @param sortDown state to determine whether to sortDown or sortUp the offering by term
 * @param onSort callback for setState stortDown
 * @param courseOfferings courseOfferings of the instructor
 * @param userId instructorId for the need of creating an offering
 */
export function Courses(props) {
  const {courseOfferings, userId, departments, courseActivePane} = props.state;
  /**
   * Generate the tab panes for each course, where contains the offering list
   */
  var panes = [];
  courseOfferings.forEach( (courseOffering, index) => {
    // console.log(index, courseOffering)
    const { course } = courseOffering
    const department = handleData.findById(departments, course.departmentId) || api.initialData.initialDepart
    panes.push({
      as: 'button',
      key: course.id + index,
      menuItem: department.acronym + course.courseNumber,
      render: () => (
        <div style={{marginLeft: '-2rem', borderRight: 'solid 1px transparent'}}>
          <OfferinfList 
            courseOffering={courseOffering}
            department={department}
            {...props}
            {...props.state}
          />
        </div>
      )
    })
  })

  panes = handleData.distinct(panes, 'menuItem')
  const activeIndex = courseActivePane >= courseOfferings.length ? courseOfferings.length - 1 : courseActivePane
  
  return (
    <div className="ip-content">
      <Title userId={userId}/>
      {
        courseOfferings.length ? 
        <Tab 
          panes={panes} 
          defaultActiveIndex={activeIndex} 
          menu={{ fluid: true, vertical: true, tabular: true, borderless: true }} 
          onTabChange={(event, {activeIndex}) => props.setActivePane(activeIndex)}
        /> 
        : 
        <EmptyResult userId={userId}/>
      }
    </div>
  )
}

/**
 * Titles and 'Create new offering' button
 */
function Title({userId}) {
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
            as={Link} variant="secondary" 
            to={util.links.newOffering(userId)}
            style={{marginRight:'-2rem'}}
            aria-label="create a new offering"
          >
            <i class="fas fa-plus"></i>&ensp;New Offering
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

/**
 * Show when there is no courses created yet
 */
function EmptyResult({userId}) {
  return (
    <div className="empty">
      <div>
        <h2>WELCOME TO</h2>
        <h1>CLASS TRANSCRIBE</h1>
      </div>
      <Button 
        as={Link} size='big' secondary
        to={`/instructor/offering-setting/new=${userId}`}
        style={{width: 'max-content', marginTop: '1rem'}} 
        aria-label="create a new offering"
      >
        Create Your First Offering HERE!
      </Button>
    </div>
  )
}