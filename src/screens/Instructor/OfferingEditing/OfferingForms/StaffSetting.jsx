/**
 * Form Component for Editing Offerings
 * - Add or remove course staffs for a offering
 */

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
        {/* upload file button */}
        <Grid.Column width={3}>
          <h5>Upload a .csv file</h5>
          <div className="upload-box">
            <input type="file" />
            <Button 
              className="upload-button" 
              content="Browse Files"
              aria-label="browse files"
            />
          </div>
        </Grid.Column>
        <Grid.Column width={2} style={{height: '5rem'}}>
          <Divider vertical>or</Divider>
        </Grid.Column>

        {/* input to add instructors */}
        <Grid.Column>
          <Form.Field
            fluid 
            control={Input}
            type="email"
            label="Enter the emails"
            aria-label="enter the emails"
            value={staffMailId}
            onChange={onEnterStaffMailId}
            onKeyDown={addStaff}
          />
          <Label.Group>
            {staffs.map( staff => (
              <Label key={staff}>
                {staff}
                <Icon 
                  name="delete" 
                  onClick={()=>removeStaff(staff)} 
                  title="remove" aria-label="remove" 
                />
              </Label>
            ))}
          </Label.Group>
        </Grid.Column>
      </Grid.Row>

      {/* progress buttons */}
      <Grid.Row>
        <Grid.Column>
          <Button  secondary onClick={()=>toProgress('TermSecType')} aria-label="go back">
            <Icon name="chevron left"/> Back
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}
