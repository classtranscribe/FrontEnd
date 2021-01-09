import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import './stylesheets/general.vars.css';
import './stylesheets/general.transition.css';
import './stylesheets/general.animation.css';
import './stylesheets/general.class.css';
import './stylesheets/sidebar.css';
import './stylesheets/csstrans.playlist-video.css';
import './stylesheets/sk-loader.css';
import './stylesheets/semantic-ui-css/semantic-ui.min.css';
import './index.css';

export { SignInPrompt } from './SignInPrompt';

export * from './Cards';

export { CTModal } from './Modals';
export { default as CTImagePickerModal } from './CTImagePickerModal';
export { default as CTImageMagnifer } from './CTImageMagnifer';
export { CTMarkdownEditor, CTMarkdownPreviewer } from './CTMarkdown';
export { SelectCtrlButton } from './SelectCtrlButton';
export { default as CTPlaylistIcon } from './CTPlaylistIcon';
export { default as CircularProgress } from './CircularProgress';
export { default as InfoAndListLayout } from './InfoAndListLayout';
export { default as CopyButton } from './CopyButton';
export { CTShortcutModal, CTShortcutTable } from './Shortcut';


// Need to be removed later

/**
 * General Components
 */

export function MaintenanceMessage() {
  const begin = new Date('2019-09-26T00:00:00');
  const end = new Date('2019-09-28T22:00:00');
  const current = new Date();
  const [open, setOpen] = useState(current >= begin && current <= end);
  return (
    <Alert show={open} dismissible onClose={() => setOpen(false)} variant="primary">
      <i className="material-icons">announcement</i>
      <p>
        ClassTranscribe will be down from <strong>September 27 10:00pm</strong> to{' '}
        <strong>September 28 10:00pm</strong>. Thanks for your patience.
      </p>
    </Alert>
  );
}

export function SidebarDimmer({ show, onClose }) {
  return (
    <div
      style={{ display: show ? 'block' : 'none' }}
      className="sidebar-dimmer"
      onClick={onClose}
    />
  );
}
