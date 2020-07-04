import React from 'react';
import { CTMarkdownEditor } from 'components';

export function MarkdownEditor({
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
