
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '../../../Utils'
import { Button } from 'pico-ui'
import { CTForm } from '../../../../../components'
import { UploadBtn } from './UploadButton'
import { Grid, Icon } from 'semantic-ui-react'
import { util } from '../../../../../utils'

function StudentsWithRedux({

}) {

  const [emails, setEmails] = useState([])
  const [results, setResults] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (emails.length > 0) {
      setResults(emails)
    }
  }, [emails])

  const onInputChange = value => {
    setInputValue(value)
  }

  const onSearch = ({ target: { value } }) => {
    setSearchValue(value)
  }

  const addStudent = () => {
    if (!inputValue) return;
    if (!util.isValidEmail(inputValue)) {
      return setError('Please enter a valid email.')
    }
    let includes = _.includes(emails, inputValue)
    if (!includes) {
      setEmails([ ...emails, inputValue ])
      setInputValue('')
      if (Boolean(error)) setError(null)
    }
  }

  const addNew = newEmails => {
    newEmails = _.filter(newEmails, email => {
      if (!email || !util.isValidEmail(email)) return false
      if (_.includes(emails, email)) return false
      return true
    })
    
    setEmails([ ...emails, ...newEmails ])
  }

  const removeStudent = email => {
    _.remove(emails, e => e === email)
    setEmails([ ...emails ])
  }

  return (
    <div className="ip-f-section ct-a-fade-in">
      <div className="ip-f-title">
        <h3>Add Students</h3>
      </div>

      <Grid columns='equal' stackable className="ip-f-grid">
        <Grid.Row>
          <Grid.Column>
            <div className="ct-list-col">
              <div className="ct-d-r-center-v">
                <CTForm 
                  label="Add Student"
                  color="grey"
                  type="email"
                  placeholder="Enter email here..."
                  value={inputValue}
                  onChange={onInputChange}
                  onReturn={addStudent}
                  error={error}
                />
                <div className="ip-f-add-email-btn">
                  <Button uppercase compact
                    text="Add"
                    color="teal transparent"
                    onClick={addStudent}
                  />
                </div>
              </div>

              <UploadBtn addNew={addNew} />
            </div>
          </Grid.Column>

          <Grid.Column>
            <div className="ip-f-email-container">
              {/* Search */}
              <input 
                className="ip-f-email-filter" 
                placeholder="Search ..."
                value={searchValue}
                onChange={onSearch}
                type="text"
                autocomplete="no"
              />
              {/* Email List */}
              <div className="ip-f-email-group" role="list">
                {
                  !results.length ? 
                  <p className="guide pt-5 w-100 d-flex justify-content-center">NONE</p> 
                  :
                  (results.slice() || []).reverse().map( email => (
                    <div className="ip-f-email-item " key={email}>
                      {email}
                      <Icon 
                        name="trash" 
                        onClick={() => removeStudent(email)} 
                        title="remove" 
                        aria-label="remove" 
                        role="button"
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export const Students = connectWithRedux(
  StudentsWithRedux,
  [],
  []
)