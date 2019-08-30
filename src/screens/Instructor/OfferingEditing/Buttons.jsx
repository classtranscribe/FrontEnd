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
        <Button 
          positive 
          onClick={props.onCreate} 
          content="Save"
          aria-label="save"
        />
      }
      <Button onClick={props.onCancel} content="Cancel" aria-label="cancel" />
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

      <Button 
        disabled={!canSave} 
        positive 
        onClick={props.onUpdate} 
        content="Save"
        aria-label="save" 
      />
      
      <Button secondary onClick={props.onCancel} content="Cancel" aria-label="cancel" />
      {
        offering // can delete the offering iff the offering is loaded
        && 
        <Button onClick={props.showDeleteModal} content="Delete" aria-label="delete" />
      }
    </>
  )
}