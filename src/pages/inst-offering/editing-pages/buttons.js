import React from 'react';
import { Button } from 'semantic-ui-react'


export function SaveButtons({canSave, onCancel, onCreate}) {
  return (
    <>
      {
        canSave // can save the offering iff all the fields if filled
          &&
        <Button positive onClick={onCreate} >Save</Button>
      }
      <Button onClick={onCancel} >Cancel</Button>
    </>
  )
}

export function EditButtons({canSave, canDelete, onCancel, onUpdate, onDelete}) {
  return (
    <>
      {
        canSave // can save the offering iff all the fields if filled
        &&
        <Button positive onClick={onUpdate} >Save</Button>
      }
      <Button secondary onClick={onCancel} >Cancel</Button>
      {
        canDelete // can delete the offering iff the offering is loaded
        && 
        <Button onClick={onDelete} >Delete</Button>
      }
    </>
  )
}



