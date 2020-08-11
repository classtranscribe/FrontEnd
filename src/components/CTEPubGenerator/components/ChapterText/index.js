import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import { elem } from 'utils/use-elem';
import { MDPreviewer, MDEditor } from '../Markdown';
import ChapterEditButton from '../ChapterEditButton';
import './index.scss';

export function ChapterText({
  text = '',
  id = '',
  className,
  onSaveText,
  addNewText = 'Click to add content',
  attached,
  height = '300px'
}) {
  const [editing, setEditing] = useState(false);

  const startEditing = () => setEditing(true);
  const closeEditing = () => setEditing(false);

  const onSave = (newText) => {
    if (typeof onSaveText === 'function' && newText !== text) {
      onSaveText(newText);
    }
    closeEditing();
  };

  const isNotEmpty = Boolean(text.trim());

  useEffect(() => {
    if (editing) {
      setEditing(false);
    }
  }, [text]);

  useEffect(() => {
    if (editing) {
      elem.scrollIntoCenter(id);
    }
  }, [editing]);

  const txtConClasses = cx('ct-epb', 'ch-text-con', className, { attached });

  return (
    <div id={id} className={txtConClasses}>
      {editing ? (
        <div className="w-100 mb-4">
          <MDEditor
            height={height}
            id={`md-editor-${id}`}
            defaultValue={text}
            onSave={onSave}
            onClose={closeEditing}
            attached={attached}
          />
        </div>
      ) : (
        <Popup
          inverted
          basic
          openOnTriggerFocus
          openOnTriggerClick={false}
          openOnTriggerMouseEnter
          closeOnTriggerMouseLeave
          closeOnTriggerBlur
          content="Click to edit"
          position="top center"
          disabled={!isNotEmpty}
          trigger={
            <ChapterEditButton 
              onClick={startEditing} 
              muted={!isNotEmpty} 
              attached={attached}
              data-empty={isNotEmpty}
            >
              {isNotEmpty ? <MDPreviewer value={text} /> : addNewText}
            </ChapterEditButton>
          }
        />
      )}
    </div>
  );
}
