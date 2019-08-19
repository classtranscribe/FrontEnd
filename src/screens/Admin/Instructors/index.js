/**
 * Pane for Instructors of Admin Page
 */

import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { api, handleData } from 'utils'
// UI
// import DepartmentEditing from './DepartmentEditing'
import { CreateNewButton, AdminListItem, GeneralAlert } from '../Components'
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react'

export default function InstructorPane({ state: {universities}, getSelectOptions}) {
  const [instructors, setInstructors] = useState([]) //'unset'
  const [uniOptions, setUniOptions] = useState([])
  const [currUni, setCurrUni] = useState({id: 0})

  useEffect(() => {
    if (universities.length) {
      setUniOptions(() => getSelectOptions(universities))
      const uniId = localStorage.getItem('instCurrUni')
      if (uniId) onUniSelect({ value: uniId })
    }
  }, [universities])

  const onUniSelect = ({value}) => {
    setCurrUni(() => handleData.findById(universities, value))
    api.getRolesByUniId(value).then(({data}) => {
      setInstructors(() => data)
      console.log('instructors', data)
      localStorage.setItem('instCurrUni', value)
    })
  }
  
  return (
    <Tab.Pane attached={false} className="ap-list" loading={false}> 
      <Route path='/admin/instructor/:type?=:id' component={null}/>  

      <Message color="black">
        <Message.Header>Select from Universities</Message.Header>
        <p>Current University: <strong>{currUni.name}</strong></p>
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            defaultValue={localStorage.getItem('instCurrUni')}
            onChange={(event, data) => onUniSelect(data)}
          />
        </Form>
      </Message>
      
      {
        currUni.id === 0 ? 
        <GeneralAlert type='selectUni' open fixed /> :
        <>
          <CreateNewButton name='Add New Instructor' path='instructor' id={currUni.id}/>
          <Divider horizontal>All Instructors</Divider>
          {instructors.reverse().map( inst => (
              <AdminListItem 
                header={`${inst.firstName} ${inst.lastName}`} 
                path="instructor"
                id={inst.id} key={inst.id}
                items={[
                  `University: ${currUni.name}`,
                  `Email: ${inst.email}`
                ]}
              />
          ))}
        </>
      }
    </Tab.Pane>
  )
}