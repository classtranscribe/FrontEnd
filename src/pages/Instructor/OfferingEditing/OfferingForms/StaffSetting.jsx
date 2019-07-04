import React from 'react'
// Layouts
import { Grid, Form, Input, Button, Icon, Label, Divider, Popup } from 'semantic-ui-react'
// Vars

export default function StaffSetting({toProgress, state: { staffMailId, staffs }, addStaff, removeStaff, onEnterStaffMailId}) {
  return (
    <>
      <h2>3. Add Course Staffs (Optional)</h2>
      <Popup
        basic position="right center"
        trigger={<Icon name="question circle outline" size="large" color="black"/>}
        content={
          <p>Add Course Staffs to the Offering Admin List</p>
      }/>
      <Grid.Row>
        <Grid.Column width={3}>
          <h5>Upload a .csv file</h5>
          <div className="upload-box">
            <input type="file" />
            <Button className="upload-button" >
              Browse Files
            </Button>
          </div>
        </Grid.Column>
        <Grid.Column width={2} style={{height: '5rem'}}>
          <Divider vertical>or</Divider>
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid 
            id='course-staff-email-id'
            control={Input}
            type="email"
            label="Enter the email of the staff"
            value={staffMailId}
            onChange={onEnterStaffMailId}
            onKeyDown={addStaff}
          />
          <Label.Group>
            {staffs.map( staff => (
              <Label key={staff}>
                {staff}
                <Icon name="delete" onClick={()=>removeStaff(staff)}/>
              </Label>
            ))}
          </Label.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button  secondary onClick={()=>toProgress('TermSecType')}>
          <Icon name="chevron left"/> Back
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}
