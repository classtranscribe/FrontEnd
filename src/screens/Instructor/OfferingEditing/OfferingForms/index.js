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
import StudentsSetting from './StudentsSetting'
// Vars

export default function OfferingForm(props) {
  const { loading, offering } = props.state
  
  return (
    <Form className="op-form" role='form' aria-label='Offering Setting Form'>
      {
        !loading ?
        <Grid columns='equal'  stackable className="op-grid"> 
          <CourseSetting {...props} />
          <TermSectionTypeSetting {...props} />
          {offering.offering.accessType === 2 && <StudentsSetting {...props} />}
          <StaffSetting {...props} />
        </Grid> 
        : 
        <GeneralLoader loading inverted />
      }
    </Form>
  )
}