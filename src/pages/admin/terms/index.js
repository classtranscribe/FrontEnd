import React from 'react'
import {Route} from 'react-router-dom'
import authentication from 'react-azure-adb2c'
import EditTermPage from './edit-term'
import { CreateNewButton, AdminListItem, GeneralAlert } from '../admin-components'
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react'

export default function TermPane(props) {
  const {terms, universities, termCurrUni, termLoading} = props.state;
  const uniOptions = props.getSelectOptions(universities);
  const currUni = termCurrUni || {name: 'none', id: 0};
  
  return (
    <Tab.Pane attached={false} className="ap-list" loading={termLoading}>
      <Route path='/admin/term/:id' component={authentication.required(EditTermPage)}/>     
      <Message color="black">
        <Message.Header>Select from Universities</Message.Header>
        <p>Current University: <strong>{currUni.name}</strong></p>
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            defaultValue={currUni.id}
            onChange={(event, data)=>props.setCurrent('termCurrUni', data)}
          />
        </Form>
      </Message>

      {
        currUni.id === 0 ? 
        <GeneralAlert type='selectUni' open fixed /> :
        <>
          <CreateNewButton name='Create New Terms' path='term' id={currUni.id}/>
          <Divider horizontal>All Terms</Divider>
          {terms.slice().reverse().map( term => (
              <AdminListItem 
                header={term.name} 
                path={'term'}
                id={term.id}
                items={[
                  `Start Date: ${term.startDate}`,
                  currUni.name
                ]}
              />
          ))}
        </>
      }
      
    </Tab.Pane>
  )
}