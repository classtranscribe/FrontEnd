/**
 * Form Components for editing offerings
 */

import React from 'react'
// Layouts
import { Grid, Form } from 'semantic-ui-react'
import { GeneralLoader } from 'components'

import CourseSetting from './CourseSetting'
import TermSectionTypeSetting from './TermSectionType'
import StaffSetting from './StaffSetting'
// Vars

export default function OfferingForm(props) {
  const { loading, progress } = props.state
  
  return (
    <Form className="op-form" role='form' aria-label='Offering Setting Form'>
      {
        !loading ?
        <Grid columns='equal'  stackable className="op-grid"> 
          {
            true //progress === 'Courses'
            &&
            <CourseSetting {...props} />
          }
          {
            true //progress === 'TermSecType' 
            &&
            <TermSectionTypeSetting {...props} />
          }
          {
            true //progress === 'Staffs'
            &&
            <StaffSetting {...props} />
          }
        </Grid> 
        : 
        <GeneralLoader loading inverted />
      }
    </Form>
  )
}