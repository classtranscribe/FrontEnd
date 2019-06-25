import React from 'react'
import { UniForm } from './forms'
import { Tab, Divider, Grid, Button, Form, Input, Message, Accordion } from 'semantic-ui-react'

export default function UniPane(props) {
  const universities = props.state.universities;
  return (
    <Tab.Pane attached={false} className="ap-list">
      <Divider horizontal>Create New University</Divider>
      <UniForm {...props} />
      <Divider horizontal>All Universities</Divider>
      {universities.slice().reverse().map( university => (
        <>
        <h4 className="ap-id">ID: {university.id}</h4>
        <Message>
          <Message.Header>{university.name}</Message.Header>
          <p>Domain:&ensp;{university.domain}</p>
        
          <Accordion exclusive={false} fluid panels={[{
            key: university.id,
            title: 'Edit',
            content: {
              content: 
              <Form className="ap-list-item">
                <Grid columns='equal' verticalAlign="middle">
                  <Grid.Row >
                    <Grid.Column>
                      <Form.Field
                        fluid
                        id='uni-name-edit'
                        control={Input}
                        label='University Name'
                        placeholder='E.g. University of Illinois at Urbana Champaign'
                        defaultValue={university.name}
                        onChange={event => props.onFormChange(event, 'editUni', 'name')}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field
                        fluid
                        id='uni-domain'
                        control={Input}
                        label='Domain'
                        placeholder='E.g. ...'
                        defaultValue={university.domain}
                        onChange={event => props.onFormChange(event, 'editUni', 'domain')}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column className="ap-buttons">
                      <Button 
                        secondary attached='left' 
                        onClick={()=>props.onUpdate('editUni', university)}
                        >Update</Button>
                      <Button 
                        negative attached='right'
                        onClick={()=>props.onDelete('uni', university)}
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