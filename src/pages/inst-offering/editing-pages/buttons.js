/**
 * Button-Group Components for saving or updating
 */

import React from 'react';
import { Button } from 'semantic-ui-react'

export function SaveButtons({canSave, onCancel, onCreate}) {
  return (
    <>
      <Button disabled={!canSave} positive onClick={onCreate} >Save</Button>
      <Button onClick={onCancel} >Cancel</Button>
    </>
  )
}

export function EditButtons({canSave, canDelete, onCancel, onUpdate, onDelete}) {
  return (
    <>
      <Button disabled={!canSave} positive onClick={onUpdate} >Save</Button>
      <Button secondary onClick={onCancel} >Cancel</Button>
      <Button disabled={!canDelete} onClick={onDelete} >Delete</Button>
    </>
  )
}



