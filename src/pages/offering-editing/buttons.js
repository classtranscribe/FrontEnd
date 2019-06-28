import React from 'react'
import { Button } from 'semantic-ui-react'

export function SaveButtons(props) {
  const { courseId } = props.state.offeringInfo;
  const { termId, sectionName } = props.state.offeringInfo.offering;
  const canSave = termId && sectionName && courseId;
  return (
    <>
      {
        canSave 
          &&
        <Button positive onClick={props.onCreate} >Save</Button>
      }
      <Button onClick={props.onCancel} >Cancel</Button>
    </>
  )
}

export function EditButtons(props) {
  return (
    <>
      <Button 
        positive 
        onClick={props.onCreate}
        >Save</Button>
      <Button 
        negative
        onClick={props.onDelete}
        >Delete</Button>
      <Button 
        onClick={props.onCancel}
        >Cancel</Button>
    </>
  )
}