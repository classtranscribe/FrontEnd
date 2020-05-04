import React, { useState } from 'react';
import {
  MarkdownPreviewer,
  MarkdownEditor
} from '../../../Markdown';
import './index.scss';
import { epub } from 'screens/MediaSettings/Utils/epub';
import { Popup } from 'semantic-ui-react';

function ChapterText({
  text = '',
  id = '',
  chapter,
}) {

  const [editing, setEditing] = useState(false);

  const startEditing = () => setEditing(true);
  const closeEditing = () => setEditing(false);

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) {
      startEditing();
    }
  }

  const onChooseImage = () => {
    
  }

  const onSaveText = () => {
    closeEditing();
  }

  const { content } = epub.parseText(text);
  const screenshots = epub.getAllImagesInChapter(chapter);
  const { image } = chapter;

  return (
    <div className="ee-ech-ch-text-con">
      {
        editing
        ?
        <MarkdownEditor
          id={id}
          defaultValue={content}
          onSave={onSaveText}
          onClose={closeEditing}
          screenshots={screenshots}
          defaultImage={image}
          onChooseImage={onChooseImage}
        />
        :
        <Popup inverted basic
          openOnTriggerFocus
          openOnTriggerClick={false}
          openOnTriggerMouseEnter
          closeOnTriggerMouseLeave
          closeOnTriggerBlur
          content="Click to Edit"
          position="top center"
          trigger={
            <div
              className="ee-ech-ch-text"
              tabIndex={0}
              onClick={startEditing}
              onKeyDown={handleKeyDown}
            >
              <MarkdownPreviewer value={text} />
            </div>
          }
        />
      }
    </div>
  );
}

export default ChapterText;
