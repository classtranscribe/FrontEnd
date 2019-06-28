import React from 'react'
import { Button, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export { GeneralLoader, GeneralModal, GeneralAlert } from '../../components'


export function AdminListItem(props) {
  return (
    <Message className='ap-listitem'>
      <div className='ap-iteminfo'>
        <Message.Header>{props.header}</Message.Header>
        <Message.List items={props.items} />
      </div>
      <div className="ap-buttons">
        <Button 
          as={Link}
          to={`/admin/${props.path}/${props.id}`}
          secondary compact 
        >
          <i class="fas fa-edit"></i>&ensp;Edit
        </Button>
      </div>
    </Message>
  )
}

export function CreateNewButton(props) {
  return (
    <div className='ap-buttons'>
      <Button
        as={Link}
        to={`/admin/${props.path}/new=${props.id}`}
        secondary
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
      onClick={props.onCancel}
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
      onClick={props.onCancel}
      >Cancel</Button>
    </>
  )
}
