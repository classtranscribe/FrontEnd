import React from 'react';
import { CTShortcutModal } from 'components/Shortcut';
import { shortcuts } from '../controllers/constants/shortcuts';
import { epub, connectWithRedux } from '../controllers';

function ShortcutModal({ showShortcuts }) {
  const onClose = () => epub.state.setShowShortcuts(false);

  return (
    <CTShortcutModal
      fullWidth
      open={showShortcuts}
      shortcuts={shortcuts}
      onClose={onClose}
    />
  );
}

export default connectWithRedux(
  ShortcutModal,
  ['showShortcuts']
);
