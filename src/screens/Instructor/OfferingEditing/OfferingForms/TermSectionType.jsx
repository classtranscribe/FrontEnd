/**
 * Form Component for Editing Offerings
 * - term, section name and access type
 */

import React from 'react'
// Layouts
import { Grid, Form, Input, Select, TextArea } from 'semantic-ui-react'
// Vars
import { api, util } from 'utils'

const logEventsFlagOpts = [
  { text: "True", value: true },
  { text: "False", value: false }
]

export default function TermSectionTypeSetting({state, onChange}) {
  const { offering, terms } = state

  const termOptions = util.getSelectOptions(terms)
  const accessOptions = util.getSelectOptions(api.offeringAccessType)
  
  return (
    <>
      <h2>Basic Information</h2>

      <Grid.Row >
        {/* Course Name */}
        <Grid.Column>
          <Form.Field
            fluid required
            control={Input}
            label="Name"
            aria-label="Course name"
            placeholder='E.g. System Programming'
            value={offering.offering.courseName}
            onChange={(event, {value}) => onChange(value, 'courseName')}
          />
        </Grid.Column>
        {/* Selection for terms */}
        <Grid.Column>
          <Form.Field
            fluid required search
            control={Select}
            label="Term"
            aria-label="term"
            options={termOptions}
            value={offering.offering.termId}
            onChange={(event, {value}) => onChange(value, 'termId')}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row >

        {/* Section number */}
        <Grid.Column>
          <Form.Field
            fluid required
            control={Input}
            label="Section Number"
            aria-label="section number"
            placeholder='E.g. AL1'
            value={offering.offering.sectionName}
            onChange={({target: {value}})=> onChange(value, 'sectionName')}
          />
        </Grid.Column>
        {/* Description */}
        <Grid.Column>
          <Form.Field
            fluid
            control={TextArea}
            label="Description"
            aria-label="Course Description"
            placeholder='Course Description'
            value={offering.offering.description}
            onChange={(event, {value}) => onChange(value, 'description')}
          />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row >
        {/* Access type */}
        <Grid.Column>
          <Form.Field
            fluid required 
            control={Select}
            label="Visibility"
            aria-label="visibility"
            options={accessOptions}
            value={offering.offering.accessType}
            onChange={(event, {value}) => onChange(value, 'accessType')}
          />
        </Grid.Column>
        {/* logEventsFlag */}
        <Grid.Column>
          <Form.Field
            fluid 
            control={Select}
            label="Log Student Events"
            aria-label="visibility"
            options={logEventsFlagOpts}
            value={offering.offering.logEventsFlag}
            onChange={(event, {value}) => onChange(value, 'logEventsFlag')}
          />
          <p className="guide">Turn it on if you'd like to view the statistics of students' perfermance</p>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}