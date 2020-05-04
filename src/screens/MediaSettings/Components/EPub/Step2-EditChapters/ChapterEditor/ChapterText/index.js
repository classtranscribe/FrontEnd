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
  onChooseImage,
  onSaveText,
  screenshots,
}) {

  const [editing, setEditing] = useState(false);

  const startEditing = () => setEditing(true);
  const closeEditing = () => setEditing(false);

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) {
      startEditing();
    }
  }

  const onSave = newText => {
    if (onSaveText) onSaveText(newText);
    closeEditing();
  }

  const { content } = epub.parseText(text);
  const { image } = chapter;

  return (
    <div className="ee-ech-ch-text-con">
      {
        editing
        ?
        <div className="w-100 mb-4">
          <MarkdownEditor
            id={id}
            defaultValue={content}
            onSave={onSave}
            onClose={closeEditing}
            screenshots={screenshots}
            defaultImage={image}
            onChooseImage={onChooseImage}
          />
        </div>
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
              {
                Boolean(content.trim())
                ?
                <MarkdownPreviewer value={text} />
                :
                'Click to add content'
              }
            </div>
          }
        />
      }
    </div>
  );
}

export default ChapterText;
