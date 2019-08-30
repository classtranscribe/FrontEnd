import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { DeleteModal } from 'components'
import { List, Dropdown } from 'semantic-ui-react'
import { api, util } from 'utils'

export default function EditVideoBtn({ show, mediaName, mediaId, setIsDelete, offeringId }) {
  const display = show ? {} : {display: 'none'}
  const [confirmDeletion, SetComfirmDeletion] = useState(false)
  const onDelete = () => {
    api.deleteMedia(mediaId)
      .then(() => setIsDelete(true))
  }
  return (
    <List.Content floated='right' className="list-dropdown-btn" style={display}>
      <DeleteModal 
        open={confirmDeletion}
        target={'video ' + mediaName}
        onSave={onDelete}
        onClose={() => SetComfirmDeletion(false)}
      />
      <Dropdown 
        icon="ellipsis vertical" 
        floating direction="left" 
        aria-label={`Dropdown Buttons for Video ${mediaName}`}
        title="edit"
      >
        <Dropdown.Menu >
          <Dropdown.Item 
            as={Link}
            to={util.links.renameVideo(offeringId, mediaId)}
            icon="edit" text='Edit' 
            aria-label="edit"
          />
          <Dropdown.Item 
            icon="trash" text='Delete' 
            onClick={() => SetComfirmDeletion(true)}
            aria-label="delete"
          />
        </Dropdown.Menu>
      </Dropdown>
    </List.Content>
  )
}