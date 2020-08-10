import React from 'react'
import { CTMarkdownEditor } from 'components';
import { CTModal, CTFragment } from 'layout';

function MDEditorModal({
  show,
  value,
  onSave,
  onClose
}) {
  return (
    <CTModal
      open={show}
      size="md"
      title="Edit ePub Content"
      responsive
      withCloseButton
      onClose={onClose}
    >
      <CTFragment padding={[0, 0, 17, 0]}>
        <CTMarkdownEditor
          id="ct-md-modal-editor"
          defaultValue={value}
          onSave={onSave}
          onClose={onClose}
          height="350px"
        />
      </CTFragment>
    </CTModal>
  );
}

export default MDEditorModal;
