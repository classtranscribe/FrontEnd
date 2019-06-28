import React from 'react'
import {Route} from 'react-router-dom'
import authentication from 'react-azure-adb2c'
import EditCoursePage from './edit-course'
import { CreateNewButton, AdminListItem, GeneralAlert } from '../admin-components'
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react'

export default function CoursePane(props) {
  const { universities, courseCurrUni, courseCurrDeparts, 
          courseCurrDepart, courses, courseLoading } = props.state;
  const currUni = courseCurrUni || {name: 'none', id: 0};
  const currDepart = courseCurrDepart || {name: 'none', id: 0};
  const uniOptions = props.getSelectOptions(universities);
  const departOptions = props.getSelectOptions(courseCurrDeparts);
  
  return (
    <Tab.Pane attached={false} className="ap-list" loading={courseLoading}>
      <Route path='/admin/course/:id' component={authentication.required(EditCoursePage)}/>     
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
        {
          (currUni.id !== 0) 
          &&
          <>
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
          </>
        }
      </Message>
      {
        currUni.id === 0 ? 
        <GeneralAlert type='selectUni' open fixed /> :
        currDepart.id === 0 ?
        <GeneralAlert type='selectDepart' open fixed /> :
        <>
          <CreateNewButton name='Create New Course' path='course' id={currDepart.id}/>
          <Divider horizontal>All Courses</Divider>
          {courses.slice().reverse().map( course => (
              <AdminListItem 
                header={`${currDepart.acronym}${course.courseNumber}`} 
                path={'course'}
                id={course.id}
                items={[
                  course.courseName,
                  `Description: ${course.description}`
                ]}
              />
          ))}
        </>
      }
    </Tab.Pane>
  )
}