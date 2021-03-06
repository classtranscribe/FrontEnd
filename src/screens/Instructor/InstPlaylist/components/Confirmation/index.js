import React from 'react';
import { CTConfirmation } from 'layout';

function ConfirmationWithRedux(props) {
  const {
    confirmation,
    onClose
  } = props;
  const { title, text, onConfirm } = confirmation;

  const confirmProps = {
    open: true,
    title,
    text,
    onConfirm,
    onClose
  };

  return <CTConfirmation {...confirmProps} />;
}

export const Confirmation = ConfirmationWithRedux;