/**
 * Form Component for Offering Editing Page
 */

import React from 'react'
// Layouts
import { GeneralLoader } from '../../../components'
import { Grid, Form, Input, Select, Popup, Button, Icon, Label, Message } from 'semantic-ui-react'
// Vars
import { api, util } from '../../../util'
// const { initialOffering } = api.initialData

export default function OfferingForm(props) {
  const { isNew, loading, progress } = props.state
  
  return (
    <Form className="general-form" role='form' aria-label='Offering Setting Form'>
      {
        loading ?
        // department
        <Grid columns='equal' verticalAlign="middle" stackable className="op-grid"> 
          {
            progress === 'Courses'
            &&
            <CourseSetting {...props} />
          }
          {
            progress === 'TermSecType' 
            &&
            <TermAndAccessType {...props} />
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
  const canGoNext = selectedCourses.length
  return (
    <>
      <h2 className="op-form">1. Select Courses for Your Offering</h2>
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
      <Grid.Row style={{paddingLeft: '1rem'}}>
        <Message style={{width: '100%'}}>
          <p>Selected Courses: <span>{!selectedCourses.length && 'none'}</span></p>
          <Label.Group color='black' size="large" className="labels">
            {selectedCourses.map( course => (
              <Label>
                {course.fullCourseNumber}
                <Icon name="delete" onClick={()=>removeCourse(course.id)}/>
              </Label>
            ))}
          </Label.Group>
        </Message>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column className="ap-buttons">
          Select courses to continue&ensp;
          <Button disabled={!canGoNext} secondary onClick={()=>toProgress('TermSecType')}>
            Next <Icon name="chevron right"/>
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

function TermAndAccessType({state, onChange, toProgress}) {
  const { offering, offeringInfo, currDepart, terms } = state;
  const termOptions = util.getSelectOptions(terms)
  const accessOptions = util.getSelectOptions(api.offeringAccessType)
  return (
    <>
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
      </Grid.Row>
      <Grid.Row >
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
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-access-type'
            control={Select}
            label="Accessibility"
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
          <Button  secondary onClick={()=>toProgress('TermSecType')}>
            Next <Icon name="chevron right"/>
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

