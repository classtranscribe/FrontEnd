import React, { useState } from 'react';
import './index.scss';
import { epub } from 'screens/MediaSettings/Utils/epub';
import { MarkdownPreviewer } from '../../Markdown';

function EpubEditor({ chapters, title }) {
  const [epubHtml, setEpubHtml] = useState(epub.chaptersToMarkdown(chapters));

  return (
    <div data-scroll className="ee-dl-con">
      <h1>{title}</h1>
      <MarkdownPreviewer value={epubHtml} className="ee-dl-preview" />
    </div>
  );
}

export default EpubEditor;
