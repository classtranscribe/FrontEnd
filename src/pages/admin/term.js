import React from 'react'
import { TermForm } from './forms'
import { Tab, Divider, Segment, Grid, Button, Form, Input } from 'semantic-ui-react'

export default function TermPane(props) {
  const terms = props.state.terms;
  return (
    <Tab.Pane attached={false}>
      <Divider horizontal>Create New Term</Divider>
      <TermForm {...props} />
      <Divider horizontal>All Terms</Divider>
      {terms.slice().reverse().map( term => (
        <>
        <h4 className="ap-id">ID: {term.id}</h4>
        <Segment>
          <Form className="ap-list-item">
            <Grid columns='equal' verticalAlign="middle">
              <Grid.Row >
                <Grid.Column>
                  <Form.Field
                    fluid
                    id='term-name-edit'
                    control={Input}
                    label='Term Name'
                    placeholder='E.g. Spring 2019'
                    defaultValue={term.name}
                    onChange={event => props.onFormChange(event, 'editTerm', 'name')}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Form.Field
                    fluid
                    id='start-date-edit'
                    control={Input}
                    label='Start Date'
                    placeholder='E.g. 2199-06-23T18:38:05.281Z'
                    defaultValue={term.startDate}
                    onChange={event => props.onFormChange(event, 'editTerm', 'startDate')}
                  />
                </Grid.Column>
                <Grid.Column className="ap-buttons">
                  <Button 
                    secondary attached='left' 
                    onClick={()=>props.onUpdate('editTerm', term)}
                    >Update</Button>
                  <Button 
                    negative attached='right'
                    onClick={()=>props.onDelete('term', term)}
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