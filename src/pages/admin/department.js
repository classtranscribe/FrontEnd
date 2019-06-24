import React from 'react'
import _ from 'lodash'
import { DepartForm } from './forms'
import { Tab, Divider, Segment, Grid, Button, Form, Input, Select } from 'semantic-ui-react'

function getUniOptions(unis) {
  var options = [];
  unis.forEach( (uni, index) => {
    options.push({key: index, text: uni.name, value: uni.id})
  })
  return options;
}

function findUniById(unis, id) {
  return _.find(unis, {id: id});
}

export default function DepartPane(props) {
  const {departments, universities} = props.state;
  const uniOptions = getUniOptions(universities);
  return (
    <Tab.Pane attached={false}>
      <Divider horizontal>Create New Department</Divider>
      <DepartForm {...props} uniOptions={uniOptions} />
      <Divider horizontal>All Departments</Divider>
      {departments.slice().reverse().map( department => (
        <>
        <h4 className="ap-id">ID: {department.id}</h4>
        <Segment>
          <Form className="ap-list-item">
            <Grid columns='equal' verticalAlign="middle">
              <Grid.Row >
                <Grid.Column>
                  <Form.Field
                    fluid
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
                    fluid
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
                <Grid.Column>
                  <Form.Field
                    control={Select}
                    options={uniOptions}
                    label='University'
                    defaultValue={department.universityId}
                  />
                </Grid.Column>
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
        </Segment>
        </>
      ))}
    </Tab.Pane>
  )
}