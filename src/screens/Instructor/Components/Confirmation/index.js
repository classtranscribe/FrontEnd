import React from 'react';
import { CTModal } from 'components';
import { connectWithRedux, setup } from '../../Utils';
import './index.css';

const DEFAULT_DESCRIP = 'This action cannot be undone.';

function ConfirmationWithRedux({ confirmation = null }) {
  const onClose = () => {
    setup.confirm(null);
  };

  const onConfirm = () => {
    if (confirmation) {
      confirmation.onConfirm();
    }

    onClose();
  };

  return confirmation ? (
    <CTModal
      show
      closeOnBlur
      title={confirmation.title || 'delete confirmation'}
      saveBtnText="Confirm"
      onClose={onClose}
      onSave={onConfirm}
    >
      <div className="ip-cf-text">{confirmation.text}</div>
      <div className="ip-cf-text description">{confirmation.notice || DEFAULT_DESCRIP}</div>
    </CTModal>
  ) : null;
}

export const Confirmation = connectWithRedux(ConfirmationWithRedux, ['confirmation']);
