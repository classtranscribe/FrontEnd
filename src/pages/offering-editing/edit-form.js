import React from 'react'
import { GeneralLoader } from '../../components'
import { Grid, Form, Input, Select } from 'semantic-ui-react'
import { api, util } from '../../util'
const initialOffering = api.initialData.initialOffering;

export default function OfferingForm(props) {
  const { onChange } = props;
  const { departments, courses, terms, currDepart, offeringInfo } = props.state;
  const offering = props.isNew ? initialOffering : props.state.offering;
  const departOptions = util.getSelectOptions(departments);
  const courseOptions = util.getSelectOptions(courses, currDepart ? currDepart.acronym : '');
  const termOptions = util.getSelectOptions(terms);
  const accessOptions = util.getSelectOptions(api.offeringAccessType);

  // console.log(offeringInfo)
  return (
    <Form className="ap-form">
      {
        offering ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='offering-depart'
                control={Select}
                label='Department'
                options={departOptions}
                defaultValue={currDepart || ''}
                onChange={(event, {value}) => onChange(value, 'currDepart')}
              />
            </Grid.Column>
          </Grid.Row>
          {
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
          {
            currDepart //offeringInfo.courseId
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
          {
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
            </Grid.Row>
          }
          {
            offeringInfo.offering.sectionName
            &&
            <Grid.Row >
              <Grid.Column>
                <Form.Field
                  fluid required
                  id='offering-access-type'
                  control={Select}
                  label="Accessibility"
                  options={accessOptions}
                  defaultValue='Public'
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