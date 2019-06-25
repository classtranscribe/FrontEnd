import React from 'react'
import { DepartForm } from './forms'
import { 
  Tab, Divider, Segment, Grid, 
  Button, Form, Input, Select, 
  Message, Accordion } from 'semantic-ui-react'


export default function DepartPane(props) {
  const {departments, universities, departCurrUni} = props.state;
  const uniOptions = props.getSelectOptions(universities);
  const currUni = departCurrUni || {name: 'none', id: 0};
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
            onChange={(event, data)=>props.setCurrent('departCurrUni', data)}
          />
        </Form>
      </Message>

      <Divider horizontal>Create New Department</Divider>
      <DepartForm {...props} uniOptions={uniOptions} />
      <Divider horizontal>All Departments</Divider>
      
      {departments.slice().reverse().map( department => department.universityId === currUni.id ? (
        <>
        <h4 className="ap-id">ID: {department.id}</h4>
        <Segment>
          <Message color="black">
            <Message.Header>
              {department.name}
              <br/>Acronym: {department.acronym}
            </Message.Header>
          </Message>
          <Accordion exclusive={false} fluid panels={[{
            key: department.id,
            title: 'Edit',
            content: {
              content: 
              <Form className="ap-list-item">
                <Grid columns='equal' verticalAlign="middle">
                  <Grid.Row >
                    <Grid.Column>
                      <Form.Field
                        id='depart-name-edit'
                        control={Input}
                        label='Department Name'
                        placeholder='E.g. Mathematics'
                        defaultValue={department.name}
                        onChange={event => props.onFormChange(event, 'editDepart', 'name')}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field
                        id='depart-acronym'
                        control={Input}
                        label='Acronym'
                        placeholder='E.g. MATH'
                        defaultValue={department.acronym}
                        onChange={event => props.onFormChange(event, 'editDepart', 'acronym')}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column className="ap-buttons">
                      <Button 
                        secondary attached='left' 
                        onClick={()=>props.onUpdate('editDepart', department)}
                        >Update</Button>
                      <Button 
                        negative attached='right'
                        onClick={()=>props.onDelete('depart', department)}
                        >Delete</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            }
          }]} />
          
        </Segment>
        </>
      ):<></>)}
    </Tab.Pane>
  )
}