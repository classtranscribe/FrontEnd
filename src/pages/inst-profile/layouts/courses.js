/**
 * Component for Instructor Profile Page
 * - contents courses and offerings of the instructor
 * - where instructor can create a new offering
 */

import React from 'react'
import { Route, Link } from 'react-router-dom'
// UI & Layouts
import { Grid, Tab, Button } from 'semantic-ui-react'
import OfferinfList from './offerings'
import NewOfferingPage from '../../offering-editing'
// Vars
import { handleData, api } from '../../../util'

/**
 * @param sortDown state to determine whether to sortDown or sortUp the offering by term
 * @param onSort callback for setState stortDown
 * @param courseOfferings courseOfferings of the instructor
 * @param userId instructorId for the need of creating an offering
 */
export function Courses({onSort, state: {courseOfferings, sortDown, userId, terms, departments}}) {
  /**
   * Generate the tab panes for each course, where contains the offering list
   */
  const panes = [];
  courseOfferings.forEach( courseOffering => {
    const { course } = courseOffering;
    const department = handleData.findById(departments, course.departmentId) || api.initialData.initialDepart
    panes.push({
      key: course.id,
      menuItem: department.acronym + course.courseNumber,
      render: () => (
        <div style={{marginLeft: '-2rem', borderRight: 'solid 1px transparent'}}>
          <OfferinfList 
            terms={terms}
            department={department}
            courseOffering={courseOffering}
            onSort={onSort}
            sortDown={sortDown} 
          />
        </div>
      )
    })
  })
  
  return (
    <div className="ip-content">
      <Route path='/instructor/offering-setting/:type?=:id' component={NewOfferingPage} />
      <Title userId={userId}/>
      {
        courseOfferings.length ? 
        <Tab 
          menu={{ fluid: true, vertical: true, tabular: true, borderless: true }} 
          panes={panes} 
        /> : <EmptyResult userId={userId}/>
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