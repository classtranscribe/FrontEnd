/**
 * Pane for Courses of Admin Page
 */

import React from 'react'
import { Route } from 'react-router-dom'
// UI
import DepartmentEditing from './DepartmentEditing'
import { CreateNewButton, AdminListItem, GeneralAlert } from '../Components'
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react'

export default function DepartPane(props) {
  const { departments, universities, departCurrUni } = props.state
  const uniOptions = props.getSelectOptions(universities)
  const currUni = departCurrUni || {name: 'none', id: 0}
  
  return (
    <Tab.Pane attached={false} className="ap-list" >
      <Route path='/admin/depart/:type?=:id' component={DepartmentEditing}/>  

      <Message color="black">
        <Message.Header>Select from Universities</Message.Header>
        <p>Current University: <strong>{currUni.name}</strong></p>
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            defaultValue={localStorage.getItem('departCurrUni')}
            onChange={(event, data)=>props.setCurrent('departCurrUni', data)}
          />
        </Form>
      </Message>
      
      {
        currUni.id === 0 ? 
        <GeneralAlert type='selectUni' open fixed /> :
        <>
          <CreateNewButton name='Create New Department' path='depart' id={currUni.id}/>
          <Divider horizontal>All Departments</Divider>
          {(departments.slice() || []).reverse().map( depart => (
              <AdminListItem 
                header={depart.name} 
                path={'depart'}
                id={depart.id}
                key={depart.id}
                items={[
                  `Acronym: ${depart.acronym}`,
                  currUni.name
                ]}
              />
          ))}
        </>
      }
    </Tab.Pane>
  )
}