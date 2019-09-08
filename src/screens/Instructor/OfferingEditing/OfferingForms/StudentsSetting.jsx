/**
 * Form Component for Editing Offerings
 * - Add or remove course students for a offering
 */

import React, { useState, useEffect } from 'react'
// Layouts
import { Grid, Icon, Popup } from 'semantic-ui-react'
import { UploadBtn } from '../Buttons'
// Vars
import { search } from 'utils'

export default function StudentsSetting({state: { students }, addStudent, removeStudent }) {
  const [results, setResults] = useState(students)
  const [input, setInput] = useState('')
  useEffect(() => {
    setResults(students)
  }, [students])

  const onSearch = ({target: {value}}) => {
    setInput(value)
    if (value) setResults(search.generalSearch(students, value))
    else setResults(students)
  }

  return (
    <>
      <h2>Add Students &ensp;
        <Popup
          basic position="right center"
          trigger={<Icon name="question circle outline" size="large" color="black"/>}
          content={<p>This offering will only be visible to the following students.</p>}/>
      </h2>
      

      <Grid.Row>
        {/* upload file button */}
        <Grid.Column>
          <UploadBtn type="students" addNew={addStudent} />
        </Grid.Column>

        {/* input to add instructors */}
        <Grid.Column>
          <div className="email-container">
            <input 
              className="email-filter" 
              type="text" 
              placeholder="Search ..."
              value={input}
              onChange={onSearch}
            />
            <div className="email-group" role="list">
              {
                !results.length ? 
                <p className="guide pt-5 w-100 d-flex justify-content-center">NONE</p> 
                :
                results.map( email => (
                  <div className="email-item " key={email}>
                    {email}
                    <Icon 
                      name="trash" 
                      onClick={() => removeStudent(email)} 
                      title="remove" aria-label="remove" 
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}
