import React from 'react';
import { CTMarkdownPreviewer } from 'components'
import { chapterToPreviewHTML } from 'screens/MediaSettings/controllers/epub/chapter.html-converter';

export function MarkdownPreviewer({ value, className }) {
  const parseMarkdown = markdown => {
    const { previewHTML } = chapterToPreviewHTML(markdown);
    return previewHTML;
  };

  return (
    <CTMarkdownPreviewer 
      value={value}
      // parseMarkdown={parseMarkdown}
      className={className}
    />
  );
}
