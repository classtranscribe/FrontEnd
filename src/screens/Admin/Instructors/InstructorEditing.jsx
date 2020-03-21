import React, { useState, useEffect } from 'react'
// UI
import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../Components'
import { Grid, Form, Input } from 'semantic-ui-react'
// Vars
import { api, util } from '../../../utils'

export default function InstructorEditing({ match: {params}, history }) {
  const isNew = params.type === 'new'
  // const id = params.id
  const [loading/*, setloading*/] = useState(!isNew)
  const [mailId, setMailId] = useState('')

  useEffect(() => {
    
  }, [params])

  const callBack = {
    onCancel: () => history.goBack(),
    onClose: () => util.toAdminPage(),
    onInactive: () => 1,
    onUpdate: () => 1,
    onSubmit: () => {
      api.createRole(mailId).then(response => {
        window.location = util.links.admin()
      })
    }
  }
  const header = isNew ? 'Add New Instructor' : 'Edit the Instructor'
  const button = isNew ? <SubmitButton {...callBack} />
                        : <EditButtons {...callBack} />

  return (
    <GeneralModal 
      header={header}
      open={true} 
      onClose={callBack.onCancel}
      button={button}
    >
      <Form className="ap-form">
        {!loading? 
          <Grid columns='equal' verticalAlign="middle">
            <Grid.Row >
              <Grid.Column>
                <Form.Field
                  fluid
                  id='emailId-edit'
                  control={Input}
                  label='Email'
                  placeholder='email'
                  value={mailId}
                  onChange={({target: {value}}) => setMailId(() => value)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid> : <GeneralLoader inverted height='10rem'/>  
        }
      </Form>
    </GeneralModal>
  )
}