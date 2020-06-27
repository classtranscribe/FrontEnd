import React from 'react';
import { CTConfirmation } from 'layout';
import { connectWithRedux, setup } from '../../controllers';

function ConfirmationWithRedux({
  confirmation
}) {
  const { title, text, onConfirm } = confirmation;

  const confirmProps = {
    open: true,
    title,
    text,
    onConfirm,
    onClose: setup.closeConfirmation
  };

  return <CTConfirmation {...confirmProps} />;
}

export const Confirmation = connectWithRedux(
  ConfirmationWithRedux,
  ['confirmation']
);
