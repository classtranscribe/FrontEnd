import React, { useState } from 'react';
import './index.scss';
import { epub, connectWithRedux } from '../../../../Utils/epub';
import { MarkdownPreviewer } from '../../Markdown';
import ChapterTitle from '../../Step2-EditChapters/ChapterEditor/ChapterTitle';

function EpubEditor({
  chapters,
  title,
  onSaveTitle
}) {

  const [epubHtml, setEpubHtml] = useState(
    epub.chaptersToMarkdown(chapters)
  );
  
  return (
    <div data-scroll className="ee-dl-con">
      <ChapterTitle focus
        value={title}
        aria-label="ePub Title"
        headingType="h1"
        onSave={onSaveTitle}
      />
      <MarkdownPreviewer
        value={epubHtml}
        className="ee-dl-preview"
      />
    </div>
  );
}

export default EpubEditor;
