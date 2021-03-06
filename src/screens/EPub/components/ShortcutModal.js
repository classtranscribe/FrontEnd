import React from 'react';
import { CTShortcutModal } from 'components/Shortcut';
import { shortcuts } from '../controllers/constants/shortcuts';
import { connectWithRedux } from '../controllers';

function ShortcutModal({ showShortcuts, dispatch }) {
  const onClose = () => dispatch({ type: 'epub/setShowShortcuts', payload: false });

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
