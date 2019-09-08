/**
 * Form Component for Editing Offerings
 * - Add or remove course staffs for a offering
 */

import React, { useState, useEffect } from 'react'
// Layouts
import { Grid, Input, Button, Icon, Popup, Form } from 'semantic-ui-react'
import { UploadBtn } from '../Buttons'
// Vars
import { search } from 'utils'

export default function StaffSetting({state: { staffMailId, staffs, staffEmailExists }, addStaff, removeStaff, onEnterStaffMailId}) {
  const [results, setResults] = useState(staffs)
  const [input, setInput] = useState('')
  useEffect(() => {
    setResults(staffs)
  }, [staffs])

  const onSearch = ({target: {value}}) => {
    setInput(value)
    if (value) setResults(search.generalSearch(staffs, value))
    else setResults(staffs)
  }

  return (
    <>
      <h2>Add Course Staffs (Optional) &ensp;
        <Popup
          basic position="right center"
          trigger={<Icon name="question circle outline" size="large" color="black"/>}
          content={<p>Add Course Staffs to the Offering Admin List</p>}/>
      </h2>
      

      <Grid.Row>
        {/* upload file button */}
        <Grid.Column>
          <Input
            fluid 
            type="email"
            aria-label="enter the emails"
            placeholder="Enter email here ..."
            value={staffMailId}
            onChange={onEnterStaffMailId}
          >
            <input />
            <Button type="submit" onClick={addStaff}>Add</Button>
          </Input>
          <p className="warning">{staffEmailExists && 'Sorry, this email has already been added.'}</p>
          <UploadBtn type="staffs" addNew={addStaff} />
        </Grid.Column>

        {/* input to add instructors */}
        <Grid.Column>
          <div className="email-container">
            <input 
              className="email-filter" 
              placeholder="Search ..."
              value={input}
              onChange={onSearch}
              type="text"
            />
            <div className="email-group" role="list">
              {results.slice().reverse().map( email => (
                <div className="email-item " key={email}>
                  {email}
                  <Icon 
                    name="trash" 
                    onClick={() => removeStaff(email)} 
                    title="remove" aria-label="remove" 
                  />
                </div>
              ))}
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}
