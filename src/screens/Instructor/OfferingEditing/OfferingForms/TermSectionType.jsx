/**
 * Form Component for Editing Offerings
 * - term, section name and access type
 */

import React from 'react'
// Layouts
import { Grid, Form, Input, Select } from 'semantic-ui-react'
// Vars
import { api, util } from 'utils'

const logEventsFlagOpts = [
  {text: "True", value: true},
  {text: "False", value: false}
]

export default function TermSectionTypeSetting({state, onChange}) {
  const { offering, terms } = state
  const termOptions = util.getSelectOptions(terms)
  const accessOptions = util.getSelectOptions(api.offeringAccessType)
  return (
    <>
      <h2>Basic Information</h2>

      <Grid.Row >
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