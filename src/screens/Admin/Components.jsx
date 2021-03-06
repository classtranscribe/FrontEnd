/**
 * Some General Components used by editing pages for Admin Page
 * - contents AdminListItem, CreateNewButton, SubmitButton, and EditButtons
 * - also transfers some components from the folder components
 */

import React from 'react';
import { Button, Message, Icon, Modal } from 'semantic-ui-react';
import { Link } from 'dva/router';

export { CTLoader as GeneralLoader } from 'layout';
export { GeneralAlert } from './Alerts';

export function GeneralModal({ size, open, onClose, header, children, button, dimmer }) {
  return (
    <Modal
      className="general-modal"
      size={size || 'small'}
      open={open}
      onClose={onClose}
      dimmer={dimmer}
    >
      {header && <Modal.Header className="gm-header">{header}</Modal.Header>}
      {children && (
        <Modal.Content image className="gm-content">
          {children}
        </Modal.Content>
      )}
      {button && <Modal.Actions className="gm-action">{button}</Modal.Actions>}
    </Modal>
  );
}

export const AdminHeading = ({ name }) => <><h1>{name}</h1><hr /></>;

/**
 * List Item component for Admin Page
 * @param header header for a list item
 * @param items details about this list item
 * @param path path to the editing page
 * @param id the id of the item, for completing the path to editing page
 */
export function AdminListItem({ header, items, path, id, inactive, loading }) {
  return (
    <Message className="ap-listitem">
      <div className="ap-iteminfo">
        <Message.Header>{header}</Message.Header>
        <Message.List items={items} role="list" />
      </div>
      <div className="ap-buttons">
        {inactive ? (
          <Button secondary compact onClick={inactive} loading={loading}>
            <Icon name="trash" />
            Inactive
          </Button>
        ) : (
          <Button
            as={Link}
            secondary
            compact
            to={`/admin/${path}/id=${id}`}
            title="Edit"
            aria-label="Edit"
          >
            <Icon name="edit" />
            Edit
          </Button>
        )}
      </div>
    </Message>
  );
}

/**
 * Button Component for create a new XXX
 * @param id the one-level-up id used for creating ...
 * @param path path to the creating page
 * @param name the text will show on the button
 */
export function CreateNewButton({ path, id, name }) {
  return (
    <div className="ap-buttons">
      <Button
        as={Link}
        to={`/admin/${path}/new=${id}`}
        secondary
        content={name}
        aria-label={name}
      />
    </div>
  );
}

/**
 * Button Group for creating
 */
export function SubmitButton({ onSubmit, onCancel }) {
  return (
    <>
      <Button secondary onClick={onSubmit} content="Submit" aria-label="submit" />
      <Button onClick={onCancel} content="Cancel" aria-label="cancel" />
    </>
  );
}

/**
 * Button Group for updating
 */
export function EditButtons({ onUpdate, onInactive, onCancel }) {
  return (
    <>
      <Button positive onClick={onUpdate} content="Update" aria-label="update" />
      <Button onClick={onInactive} content="Inactive" aria-label="inactive" />
      <Button secondary onClick={onCancel} content="Cancel" aria-label="cancel" />
    </>
  );
}
