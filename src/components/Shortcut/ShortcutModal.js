import React from 'react';
import { CTModal } from 'layout/CTModal';
import ShortcutTable from './ShortcutTable';

function ShortcutModal(props) {
  const {
    open,
    title = 'Shortcuts',
    shortcuts = [],
    onClose,
    fullWidth,
    ...modalProps
  } = props;

  return (
    <CTModal
      open={open}
      title={title}
      withCloseButton
      onClose={onClose}
      autoFocusOnCloseButton
      {...modalProps}
    >
      <ShortcutTable shortcuts={shortcuts} fullWidth={fullWidth} />
    </CTModal>
  );
}

ShortcutModal.propTypes = {
  ...CTModal.propTypes,
  ...ShortcutTable.propTypes
};

export default ShortcutModal;

