import React from 'react';
import { CTMarkdownEditor, CTMarkdownPreviewer } from 'components';

export function MDEditor({
  id = '',
  defaultValue = '',
  placeholder = '\n\n#### Transcript\n\n',
  height = '400px',
  onSave,
  onClose,
  attached
}) {
  const editorProps = {
    id,
    defaultValue,
    placeholder,
    height,
    onSave,
    onClose,
    attached
  };

  return <CTMarkdownEditor {...editorProps} />;
}

export function MDPreviewer({ value, className, id, ...otherProps }) {
  return (
    <CTMarkdownPreviewer 
      id={id}
      value={value}
      className={className}
      {...otherProps}
    />
  );
}

