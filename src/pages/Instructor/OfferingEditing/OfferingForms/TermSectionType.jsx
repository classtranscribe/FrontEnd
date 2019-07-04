import React from 'react'
// Layouts
import { Grid, Form, Input, Select, Button, Icon } from 'semantic-ui-react'
// Vars
import { api, util } from '../../../../util'

export default function TermSectionTypeSetting({state, onChange, toProgress}) {
  const { offering, offeringInfo, terms } = state
  const termOptions = util.getSelectOptions(terms)
  const accessOptions = util.getSelectOptions(api.offeringAccessType)
  const canGoNext = offeringInfo.offering.termId && offeringInfo.offering.sectionName
  return (
    <>
      <h2>2. Fill Out Basic Information</h2>
      <Grid.Row >
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-term'
            control={Select}
            label='Term'
            options={termOptions}
            value={offeringInfo.offering.termId}
            onChange={(event, {value}) => onChange(value, 'termId')}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Field
            fluid required
            id='offering-section'
            control={Input}
            label='Section Number'
            placeholder='E.g. AL1'
            value={offeringInfo.offering.sectionName}
            onChange={({target: {value}})=> onChange(value, 'sectionName')}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row >
        <Grid.Column>
          <Form.Field
            fluid required 
            id='offering-access-type'
            control={Select}
            label="Visibility"
            options={accessOptions}
            value={offeringInfo.offering.accessType}
            onChange={(event, {value}) => onChange(value, 'accessType')}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button  secondary onClick={()=>toProgress('Courses')}>
          <Icon name="chevron left"/> Back
          </Button>
        </Grid.Column>
        <Grid.Column className="ap-buttons">
          {!canGoNext && <>Fill out the fields to continue&ensp;&ensp;</>}
          <Button disabled={!canGoNext} secondary onClick={()=>toProgress('Staffs')}>
            Next <Icon name="chevron right"/>
          </Button>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}