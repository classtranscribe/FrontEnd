import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { CTForm } from 'components'
import { Grid } from 'semantic-ui-react'
import { api } from 'utils'
import { offControl } from '../../../Utils'

function BasicInfoWithRedux({
  terms=[],
  offering={},
  setAddStudents,
}) {

  const [term, setTerm] = useState('')

  const setTermId = termId => {
    offControl.termId(termId)
  }

  const setCourseName = courseName => {
    offControl.courseName(courseName)
  }

  const setSectionName = sectionName => {
    offControl.sectionName(sectionName)
  }

  const setDescription = description => {
    offControl.description(description)
  }

  const setAccessType = accessType => {
    offControl.accessType(accessType)
    if (accessType === 2) {
      setAddStudents(true)
    } else {
      setAddStudents(false)
    }
  }

  const setLogEventsFlag = logEventsFlag => {
    offControl.logEventsFlag(logEventsFlag)
  }

  const setVisibility = value => {
    if (value === 2) {
      setAddStudents(true)
    } else {
      setAddStudents(false)
    }
  }

  useEffect(() => {
    if (offering.accessType !== undefined) {
      setAddStudents(offering.accessType === 2)
    }
  }, [offering])


  const defaultTermId = offering.term ? offering.term.id : ''
  const defaultCourseName = offering.courseName
  const defaultSectionName = offering.sectionName
  const defaultDescription = offering.description
  const defaultAccessType = offering.accessType === undefined ? 0 : offering.accessType
  const defaultLogEventsFlag = offering.logEventsFlag

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
              onChange={setCourseName}
              defaultValue={defaultCourseName}
            />
          </Grid.Column>

          <Grid.Column>
            <CTForm required
              label="Section Name"
              color="grey"
              placeholder="e.g. AL1"
              defaultValue={defaultSectionName}
              onChange={setSectionName}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <CTForm required search
              label="Select a Term"
              color="grey"
              placeholder="Filter Terms"
              onChange={setTermId}
              defaultValue={defaultTermId}
              options={CTForm.getOptions(terms.slice().reverse(), 'id', 'name')}
            />
          </Grid.Column>

          <Grid.Column>
            <CTForm required select
              label="Visibility"
              color="grey"
              defaultValue={api.offeringAccessType[0].id}
              options={CTForm.getOptions(api.offeringAccessType, 'id', 'name', 'description')}
              onChange={setAccessType}
              defaultValue={defaultAccessType}
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
              defaultValue={defaultDescription}
              onChange={setDescription}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <CTForm checkbox
              label="Log student events"
              color="grey"
              description="Turn it on if you would like to receive the statistics of students' perfermance in the future."
              defaultValue={defaultLogEventsFlag}
              onChange={setLogEventsFlag}
            />
          </Grid.Column>
        </Grid.Row>

      </Grid>
    </div>
  )
}

export const BasicInfo = connectWithRedux(
  BasicInfoWithRedux,
  ['terms', 'offering'],
  []
)