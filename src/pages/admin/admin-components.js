import React from 'react'
import { Button, Message } from 'semantic-ui-react'

export { GeneralLoader, GeneralModal } from '../../components'


export function AdminListItem(props) {
  return (
    <Message className='ap-listitem'>
      <div className='ap-iteminfo'>
        <Message.Header>{props.header}</Message.Header>
        <Message.List items={props.items} />
      </div>
      <div className="ap-buttons">
        <Button 
          secondary compact 
          onClick={()=>window.location=`/#/class-transcribe-frontend/admin/${props.path}/${props.id}`}
        >
          <i class="fas fa-edit"></i>&ensp;Edit
        </Button>
      </div>
    </Message>
  )
}

export function CreateNewButton(props) {
  const id = `=${props.id}` || '';
  return (
    <div className='ap-buttons'>
      <Button
        secondary
        onClick={()=>window.location=`/#/class-transcribe-frontend/admin/${props.path}/new${id}`}
      >
      {props.name}</Button>
    </div>
  )
}

export function SubmitButton(props) {
  return (
    <>
    <Button 
      secondary 
      onClick={props.onSubmit}
      >Submit</Button>
    <Button 
      onClick={props.onClose}
      >Cancel</Button>
    </>
  )
}

export function EditButtons(props) {
  return (
    <>
    <Button 
      positive
      onClick={props.onUpdate}
      >Update</Button>
    <Button 
      onClick={props.onInactive}
      >Inactive</Button>
    <Button 
      secondary
      onClick={props.onClose}
      >Cancel</Button>
    </>
  )
}
