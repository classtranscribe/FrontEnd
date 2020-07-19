import React from 'react';
import { CTMarkdownEditor, CTMarkdownPreviewer } from 'components';

export function MDEditor({
  id = '',
  defaultValue = '',
  placeholder = '\n\n#### Transcript\n\n',
  height = '400px',
  screenshots = [],
  chapterScreenshots = [],
  defaultImage,
  onSave,
  onClose,
}) {
  let tabs = [
    {
      name: 'All Screenshots',
      images: screenshots,
    },
    'upload'
  ];

  if (chapterScreenshots.length > 0) {
    tabs = [{
      name: 'Chapter Screenshots',
      images: chapterScreenshots
    }, ...tabs];
  }

  const editorProps = {
    id,
    defaultValue,
    placeholder,
    height,
    imageTabs: tabs,
    defaultImage,
    onSave,
    onClose,
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

