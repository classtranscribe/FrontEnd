import React, { useState, useEffect } from 'react';
import { api, links, prompt } from 'utils';
import { Grid, Form, Input } from 'semantic-ui-react';
import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../Components';

export default function InstructorEditing({ match: { params }, history }) {
  const isNew = params.type === 'new';
  // const id = params.id
  const [loading, setloading] = useState(!isNew);
  const [mailId, setMailId] = useState('');

  useEffect(() => {}, [params]);

  const callBack = {
    onCancel: () => history.back(),
    onClose: () => {
      window.location = links.admin('instructors');
    },
    onInactive: () => 1,
    onUpdate: () => 1,
    onSubmit: () => {
      api
        .createInstructor(mailId)
        .then(() => {
          window.location = links.admin('instructors');
        })
        .catch(() => {
          prompt.error(`Failed to add ${mailId} as an instructor.`, 5000);
        });
    },
  };
  const header = isNew ? 'Add New Instructor' : 'Edit the Instructor';
  const button = isNew ? <SubmitButton {...callBack} /> : <EditButtons {...callBack} />;

  return (
    <GeneralModal header={header} open onClose={callBack.onCancel} button={button}>
      <Form className="ap-form">
        {!loading ? (
          <Grid columns="equal" verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  fluid
                  id="emailId-edit"
                  control={Input}
                  label="Email"
                  placeholder="email"
                  value={mailId}
                  onChange={({ target: { value } }) => setMailId(() => value)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : (
          <GeneralLoader inverted height="10rem" />
        )}
      </Form>
    </GeneralModal>
  );
}
