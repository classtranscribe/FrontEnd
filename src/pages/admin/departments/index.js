import React from 'react'
import { Route } from 'react-router-dom'
import authentication from 'react-azure-adb2c'
import EditDepartPage from './edit-depart'
import { CreateNewButton, AdminListItem, GeneralAlert } from '../admin-components'
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react'

export default function DepartPane(props) {
  const {departments, universities, departCurrUni, departLoading} = props.state;
  const uniOptions = props.getSelectOptions(universities);
  const currUni = departCurrUni || {name: 'none', id: 0};
  
  return (
    <Tab.Pane attached={false} className="ap-list" loading={departLoading}>
      <Route path='/admin/depart/:id' component={authentication.required(EditDepartPage)}/>     
      <Message color="black">
        <Message.Header>Select from Universities</Message.Header>
        <p>Current University: <strong>{currUni.name}</strong></p>
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            defaultValue={currUni.id}
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
          {departments.slice().reverse().map( depart => (
              <AdminListItem 
                header={depart.name} 
                path={'depart'}
                id={depart.id}
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