/**
 * Form Component for Offering Editing Page
 */

import React from 'react'
// Layouts
import { GeneralLoader } from '../../../components'
import { Grid, Form, Input, Select } from 'semantic-ui-react'
// Vars
import { api, util } from '../../../util'
// const { initialOffering } = api.initialData

export default function OfferingForm(props) {
  const { onChange } = props
  const { isNew, loading, offering, departments, courses, terms, currDepart, offeringInfo } = props.state
  /**
   * Get all the options for selection
   */
  const departOptions = util.getSelectOptions(departments)
  const courseOptions = util.getSelectOptions(courses, currDepart ? currDepart.acronym : '')
  const termOptions = util.getSelectOptions(terms)
  const accessOptions = util.getSelectOptions(api.offeringAccessType)

  return (
    <Form className="general-form" role='form' aria-label='Offering Setting Form'>
      {
        !loading || isNew ? 
        // department
        <Grid columns='equal' verticalAlign="middle"> 
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='offering-depart'
                control={Select}
                label='Department'
                options={departOptions}
                defaultValue={currDepart || null}
                onChange={(event, {value}) => onChange(value, 'currDepart')}
              />
            </Grid.Column>
          </Grid.Row>
          { // Course
            currDepart 
            &&
            <Grid.Row >
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='offering-course'
                  control={Select}
                  label='Course'
                  options={courseOptions}
                  defaultValue={offering.courseId}
                  onChange={(event, {value}) => onChange(value, 'courseId')}
                />
              </Grid.Column>
            </Grid.Row>
          }
          { // Term
            currDepart 
            &&
            <Grid.Row >
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='offering-term'
                  control={Select}
                  label='Term'
                  options={termOptions}
                  defaultValue={offering.offering.termId}
                  onChange={(event, {value}) => onChange(value, 'termId')}
                />
              </Grid.Column>
            </Grid.Row>
          }
          { // Section Name & access type
            offeringInfo.offering.termId
            &&
            <Grid.Row >
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='offering-section'
                  control={Input}
                  label='Section Number'
                  placeholder='E.g. AL1'
                  defaultValue={offering.offering.sectionName}
                  onChange={({target: {value}})=> onChange(value, 'sectionName')}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='offering-access-type'
                  control={Select}
                  label="Accessibility"
                  options={accessOptions}
                  defaultValue={offering.offering.accessType}
                  onChange={(event, {value}) => onChange(value, 'accessType')}
                />
              </Grid.Column>
            </Grid.Row>
          }
        </Grid> 
        : 
        <GeneralLoader loading inverted />
      }
    </Form>
  )
}