/**
 * Some General Components used by editing pages for Admin Page
 * - contents AdminListItem, CreateNewButton, SubmitButton, and EditButtons
 * - also transfers some components from the folder components
 */

import React from 'react'
import { Button, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export { GeneralLoader, GeneralModal, GeneralAlert } from '../../components'

/**
 * List Item component for Admin Page
 * @param header header for a list item
 * @param items details about this list item
 * @param path path to the editing page
 * @param id the id of the item, for completing the path to editing page
 */
export function AdminListItem({header, items, path, id}) {
  return (
    <Message className='ap-listitem'>
      <div className='ap-iteminfo'>
        <Message.Header>{header}</Message.Header>
        <Message.List items={items} />
      </div>
      <div className="ap-buttons">
        <Button 
          as={Link}
          to={`/admin/${path}/id=${id}`}
          secondary compact 
        >
          <i class="fas fa-edit"></i>&ensp;Edit
        </Button>
      </div>
    </Message>
  )
}

/**
 * Button Component for create a new XXX
 * @param id the one-level-up id used for creating ...
 * @param path path to the creating page
 * @param name the text will show on the button
 */
export function CreateNewButton({path, id, name}) {
  return (
    <div className='ap-buttons'>
      <Button
        as={Link}
        to={`/admin/${path}/new=${id}`}
        secondary
      >
      {name}</Button>
    </div>
  )
}

/**
 * Button Group for creating
 */
export function SubmitButton({onSubmit, onCancel}) {
  return (
    <>
    <Button 
      secondary 
      onClick={onSubmit}
      >Submit</Button>
    <Button 
      onClick={onCancel}
      >Cancel</Button>
    </>
  )
}

/**
 * Button Group for updating
 */
export function EditButtons({onUpdate, onInactive, onCancel}) {
  return (
    <>
    <Button 
      positive
      onClick={onUpdate}
      >Update</Button>
    <Button 
      onClick={onInactive}
      >Inactive</Button>
    <Button 
      secondary
      onClick={onCancel}
      >Cancel</Button>
    </>
  )
}
