/**
 * Form Component for Editing Offerings
 * - Add or remove associated course IDs for a offering
 */

import React from 'react'
// Layouts
import { Grid, Form, Select, Popup, Button, Icon, Label, Message, Divider } from 'semantic-ui-react'
// Vars
import { util } from 'utils'

export default function CourseSetting({state, toProgress, removeCourse, onDepartSelected, addCourse}) {
  const { departments, courses, currDepart, selectedCourses } = state
  const departOptions = util.getSelectOptions(departments)
  const courseOptions = util.getSelectOptions(courses, currDepart ? currDepart.acronym : '')
  const canGoNext = selectedCourses.length > 0
  return (
    <>
      <h2>1/3 &ensp; Select Courses</h2>
      <Popup
        basic position="right center"
        trigger={<Icon name="question circle outline" size="large" color="black"/>}
        content={
          <p>
            <strong>Why multiple courses?</strong><br/>
            Some offerings may be held by multiple departments. 
            For Example, CS425 and ECE428 have the same content.
          </p>
      }/>
      
      <Grid.Row>
        {/* Select a department */}
        <Grid.Column>
          <Form.Field
            fluid required search
            control={Select}
            label="Department"
            aria-label="department"
            options={departOptions}
            onChange={(event, {value}) => onDepartSelected(value)}
          />
          <Form.Field
            fluid required search
            control={Select}
            label='Course'
            aria-label='course'
            options={courseOptions}
            value=""
            onChange={(event, {value}) => addCourse(value)}
          />
        </Grid.Column>

        {/* Select a course */}
        <Grid.Column>
          <Message>
            <Message.Header><p>Selected Courses</p></Message.Header>
            <Divider />
            {!selectedCourses.length && <p><span>none</span></p>}
            <Label.Group size="large" role="group">
              {selectedCourses.map( course => (
                <Label key={course.id}>
                  {course.acronym + course.courseNumber}
                  <Icon 
                    name="delete" 
                    onClick={()=>removeCourse(course.id)} 
                    title="remove" aria-label="remove" 
                  />
                </Label>
              ))}
            </Label.Group>
          </Message>
        </Grid.Column>
      </Grid.Row>

      {/* Progress buttons */}
      <Grid.Row id="ap-buttons">
        <Grid.Column className="ap-buttons">
          {!canGoNext && <>Select courses to continue&ensp;&ensp;</>}
          <Button 
            disabled={!canGoNext} secondary 
            onClick={()=>toProgress('TermSecType')}
            aria-label="go next"
          >
            Next <Icon name="chevron right"/>
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}