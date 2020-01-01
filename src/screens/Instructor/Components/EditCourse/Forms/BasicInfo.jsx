import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { CTForm } from 'components'
import { Grid, Form, Select, Popup, Icon, Label, Message, Divider } from 'semantic-ui-react'
import { api } from 'utils'

function BasicInfoWithRedux({
  terms=[],
  setAddStudents,
}) {

  const [term, setTerm] = useState('')

  const onTermChange = value => {
    setTerm(value)
  }

  const setVisibility = value => {
    if (value === 2) {
      setAddStudents(true)
    } else {
      setAddStudents(false)
    }
  }

  return (
    <div className="ip-f-section">
      <div className="ip-f-title">
        <h3>basic information</h3>
      </div>

      <Grid columns='equal' stackable className="ip-f-grid">
        <Grid.Row>
          <Grid.Column>
            <CTForm required
              label="Course Name"
              color="grey"
              placeholder="e.g. System Programming"
              onChange={null}
            />
          </Grid.Column>

          <Grid.Column>
            <CTForm required
              label="Section Name"
              color="grey"
              placeholder="e.g. AL1"
              onChange={null}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <CTForm required search
              label="Select a Term"
              color="grey"
              placeholder="Filter Terms"
              onChange={onTermChange}
              options={CTForm.getOptions(terms.slice().reverse(), 'id', 'name')}
            />
          </Grid.Column>

          <Grid.Column>
            <CTForm required select
              label="Visibility"
              color="grey"
              defaultValue={api.offeringAccessType[0].id}
              options={CTForm.getOptions(api.offeringAccessType, 'id', 'name', 'description')}
              onChange={setVisibility}
              description="Choose the user group of this course."
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <CTForm textarea
              label="Description"
              color="grey"
              placeholder="Course Description"
              onChange={null}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <CTForm checkbox
              label="Log student events"
              color="grey"
              description="Turn it on if you would like to receive the statistics of students' perfermance in the future."
              onChange={null}
            />
          </Grid.Column>
        </Grid.Row>

      </Grid>
    </div>
  )
}

export const BasicInfo = connectWithRedux(
  BasicInfoWithRedux,
  ['terms'],
  []
)