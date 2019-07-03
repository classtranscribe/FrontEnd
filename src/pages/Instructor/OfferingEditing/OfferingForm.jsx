/**
 * Form Component for Offering Editing Page
 */

import React from 'react'
// Layouts
import { GeneralLoader } from '../../../components'
import { Grid, Form, Input, Select, Popup, Button, Icon, Label, Message, Divider } from 'semantic-ui-react'
// Vars
import { api, util } from '../../../util'
// const { initialOffering } = api.initialData

export default function OfferingForm(props) {
  const { isNew, loading, progress } = props.state
  
  return (
    <Form className="op-form" role='form' aria-label='Offering Setting Form'>
      {
        !loading ?
        <Grid columns='equal' verticalAlign="middle" stackable className="op-grid"> 
          {
            progress === 'Courses'
            &&
            <CourseSetting {...props} />
          }
          {
            progress === 'TermSecType' 
            &&
            <TermSectionTypeSetting {...props} />
          }
          {
            progress === 'Staffs'
            &&
            <StaffSetting {...props} />
          }
        </Grid> 
        : 
        <GeneralLoader loading inverted />
      }
    </Form>
  )
}

function CourseSetting({state, onChange, toProgress, removeCourse}) {
  const { departments, courses, currDepart, offering, offeringInfo, selectedCourses } = state
  const departOptions = util.getSelectOptions(departments)
  const courseOptions = util.getSelectOptions(courses, currDepart ? currDepart.acronym : '')
  const canGoNext = selectedCourses.length > 0
  return (
    <>
      <h2>1. Select Courses for Your Offering</h2>
      <Popup
        basic position="right center"
        trigger={<Icon name="question circle outline" size="large" color="black"/>}
        content={
          <p>
            <strong>Why multiple courses?</strong><br/>
            Some offerings may be held by multiple departments. For Example CS425 and ECE428 have the same content.
          </p>
      }/>
      
      <Grid.Row>
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-depart'
            control={Select}
            label='Department'
            options={departOptions}
            onChange={(event, {value}) => onChange(value, 'currDepart')}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-course'
            control={Select}
            label='Course'
            options={courseOptions}
            onChange={(event, {value}) => onChange(value, 'courseId')}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{padding: '0 1rem 0 1rem'}}>
        <Message>
          <Message.Header><p>Selected Courses</p></Message.Header>
          <Divider />
          {!selectedCourses.length && <p><span>none</span></p>}
          <Label.Group size="large">
            {selectedCourses.map( course => (
              <Label key={course.id}>
                {course.fullCourseNumber}
                <Icon name="delete" onClick={()=>removeCourse(course.id)}/>
              </Label>
            ))}
          </Label.Group>
        </Message>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column className="ap-buttons">
          {!canGoNext && <>Select courses to continue&ensp;&ensp;</>}
          <Button disabled={!canGoNext} secondary onClick={()=>toProgress('TermSecType')}>
            Next <Icon name="chevron right"/>
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

function TermSectionTypeSetting({state, onChange, toProgress}) {
  const { offering, offeringInfo, terms } = state
  const termOptions = util.getSelectOptions(terms)
  const accessOptions = util.getSelectOptions(api.offeringAccessType)
  const canGoNext = offeringInfo.offering.termId && offeringInfo.offering.sectionName
  return (
    <>
      <h2>2. Fill Out Basic Information</h2>
      <Grid.Row >
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-term'
            control={Select}
            label='Term'
            options={termOptions}
            value={offeringInfo.offering.termId}
            onChange={(event, {value}) => onChange(value, 'termId')}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-section'
            control={Input}
            label='Section Number'
            placeholder='E.g. AL1'
            value={offeringInfo.offering.sectionName}
            onChange={({target: {value}})=> onChange(value, 'sectionName')}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row >
        <Grid.Column>
          <Form.Field
            fluid required 
            id='offering-access-type'
            control={Select}
            label="Visibility"
            options={accessOptions}
            value={offeringInfo.offering.accessType}
            onChange={(event, {value}) => onChange(value, 'accessType')}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button  secondary onClick={()=>toProgress('Courses')}>
          <Icon name="chevron left"/> Back
          </Button>
        </Grid.Column>
        <Grid.Column className="ap-buttons">
          <Button disabled={!canGoNext} secondary onClick={()=>toProgress('Staffs')}>
            Next <Icon name="chevron right"/>
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}


function StaffSetting({toProgress, state: { staffMailId, staffs }, addStaff, removeStaff, onEnterStaffMailId}) {
  return (
    <>
      <h2>3. Add Course Staffs (Optional)</h2>
      <Grid.Row>
        <Grid.Column width={3}>
          <h5>Upload a .csv file</h5>
          <div className="upload-box">
            <input type="file" />
            <Button className="upload-button" >
              Browse Files
            </Button>
          </div>
        </Grid.Column>
        <Grid.Column width={2} style={{height: '5rem'}}>
          <Divider vertical>or</Divider>
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid 
            id='course-staff-email-id'
            control={Input}
            type="email"
            label="Enter the email of the staff"
            value={staffMailId}
            onChange={onEnterStaffMailId}
            onKeyDown={addStaff}
          />
          <Label.Group>
            {staffs.map( staff => (
              <Label key={staff}>
                {staff}
                <Icon name="delete" onClick={()=>removeStaff(staff)}/>
              </Label>
            ))}
          </Label.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button  secondary onClick={()=>toProgress('TermSecType')}>
          <Icon name="chevron left"/> Back
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

