/**
 * Button Group Components for Offering Editing Page
 */
import React from 'react'
import { Button } from 'semantic-ui-react'

/**
 * Buttons for creatind new offering
 */
export function SaveButtons(props) {
  const { progress } = props.state;
  const canSave = progress === 'Staffs'
  return (
    <>
      {
        canSave // can save the offering iff all the fields if filled
          &&
        <Button positive onClick={props.onCreate} >Save</Button>
      }
      <Button onClick={props.onClose} >Cancel</Button>
    </>
  )
}

/**
 * Buttons for editing the offering
 */
export function EditButtons(props) {
  const { offeringInfo, offering, selectedCourses } = props.state;
  const { termId, sectionName } = offeringInfo.offering;
  const canSave = termId && sectionName && selectedCourses.length;
  return (
    <>

      <Button disabled={!canSave} positive onClick={props.onUpdate} >Save</Button>
      
      <Button secondary onClick={props.onCancel} >Cancel</Button>
      {
        offering // can delete the offering iff the offering is loaded
        && 
        <Button onClick={props.showDeleteModal} >Delete</Button>
      }
    </>
  )
}