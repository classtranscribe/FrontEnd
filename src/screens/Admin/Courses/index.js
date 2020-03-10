/**
 * Pane for Courses of Admin Page
 */

import React from 'react'
import { Route } from 'react-router-dom'
// UI
import CourseEditing from './CourseEditing'
import { CreateNewButton, AdminListItem, GeneralAlert } from '../Components'
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react'

export default function CoursePane(props) {
  const { universities, courseCurrUni, courseCurrDeparts, courseCurrDepart, courses } = props.state
  const currUni = courseCurrUni || {name: 'none', id: 0}
  const currDepart = courseCurrDepart || {name: 'none', id: 0}
  const uniOptions = props.getSelectOptions(universities)
  const departOptions = props.getSelectOptions(courseCurrDeparts)
  
  return (
    <Tab.Pane attached={false} className="ap-list" >
      <Route path='/admin/course/:type?=:id' component={CourseEditing}/>    

      <Message color="black">
        <Message.Header>Select from Universities</Message.Header>
        <p>Current University: <strong>{currUni.name}</strong></p>
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            defaultValue={localStorage.getItem('courseCurrUni')}
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
                search
                control={Select}
                options={departOptions}
                defaultValue={localStorage.getItem('courseCurrDepart')}
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
          {(courses.slice() || []).reverse().map( course => (
              <AdminListItem 
                header={`${currDepart.acronym}${course.courseNumber}`} 
                path={'course'}
                id={course.id}
                key={course.id}
              />
          ))}
        </>
      }
    </Tab.Pane>
  )
}