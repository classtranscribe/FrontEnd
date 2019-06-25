import React from 'react'
import { CourseForm } from './forms'
import { Tab, Divider, Grid, 
  Button, Form, Input, Select, 
  TextArea, Message, Accordion } from 'semantic-ui-react'

export default function CoursePane(props) {
  const {universities, courseCurrUni, courseCurrDeparts, courseCurrDepart, courses} = props.state;
  const currUni = courseCurrUni || {name: 'none', id: 0};
  const currDepart = courseCurrDepart || {name: 'none', id: 0};
  const uniOptions = props.getSelectOptions(universities);
  const departOptions = props.getSelectOptions(courseCurrDeparts);

  return (
    <Tab.Pane attached={false}>
      <Message color="black">
        <Message.Header>Select from Universities</Message.Header>
        <p>Current University: <strong>{currUni.name}</strong></p>
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            defaultValue={currUni.id}
            onChange={(event, data)=>props.setCurrent('courseCurrUni', data)}
          />
        </Form>
        <Message.Header><br/>Select from Departments</Message.Header>
        <p>Current Department: <strong>{currDepart.name}</strong></p>
        <Form>
          <Form.Field
            control={Select}
            options={departOptions}
            defaultValue={currDepart.id}
            onChange={(event, data)=>props.setCurrent('courseCurrDepart', data)}
          />
        </Form>
      </Message>
      <Divider horizontal>Create New Course</Divider>
      <CourseForm {...props} uniOptions={uniOptions} departOptions={departOptions}/>
      <Divider horizontal>All Courses</Divider>
      
      {courses.slice().reverse().map( course => (
        <>
        <h4 className="ap-id">ID: {course.id}</h4>
        <Message >
          <Message.Header>
            {currDepart.acronym+course.courseNumber} <br/>{course.courseName}
          </Message.Header>
          <p>{course.description}</p>
          

          <Accordion exclusive={false} fluid panels={[{
            key: course.id,
            title: 'Edit',
            content: {
              content: 
              <Form className="ap-list-item">
                <Grid columns='equal' verticalAlign="middle">
                  <Grid.Row >
                    <Grid.Column>
                      <Form.Field
                        id='course-number-edit'
                        control={Input}
                        label='Course Number'
                        placeholder='E.g. 241'
                        defaultValue={course.courseNumber}
                        onChange={event => props.onFormChange(event, 'editCourse', 'courseNumber')}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field
                        id='course-name-edit'
                        control={Input}
                        label='Course Name'
                        placeholder='E.g. System Programming'
                        defaultValue={course.courseName}
                        onChange={event => props.onFormChange(event, 'editCourse', 'courseName')}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Form.Field
                        id='course-decription-edit'
                        control={TextArea}
                        label='Course Description'
                        placeholder='Enter course description here ...'
                        defaultValue={course.description}
                        onChange={event => props.onFormChange(event, 'editCourse', 'description')}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column className="ap-buttons">
                      <Button 
                        secondary attached='left' 
                        onClick={()=>props.onUpdate('editCourse', course)}
                        >Update</Button>
                      <Button 
                        negative attached='right'
                        onClick={()=>props.onDelete('course', course)}
                        >Delete</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            }}]} />
        </Message>
        </>
      ))}
    </Tab.Pane>
  )
}