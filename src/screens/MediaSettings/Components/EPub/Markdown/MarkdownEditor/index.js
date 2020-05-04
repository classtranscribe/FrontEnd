import React, { useState, useEffect } from 'react';
import './index.scss';
import { epub } from 'screens/MediaSettings/Utils/epub';

import MDTextArea from './MDTextArea';
import MDToolBar from './MDToolBar';
import ActionButtonGroup from './ActionButtonGroup';
import { MarkdownPreviewer } from '../MarkdownPreviewer';

export function MarkdownEditor({
  id = '',
  defaultValue='',
  placeholder='\n\n#### Transcript\n\n',
  height='400px',
  screenshots=[],
  defaultImage,

  onSave,
  onClose,
  onChooseImage,
}) {

  const [value, setValue] = useState(
    defaultValue.trim()
    ? defaultValue
    : placeholder
  );
  const [ace, setAce] = useState(null);
  const [preview, setPreview] = useState(null);

  const isPreview = Boolean(preview);

  const onChange = newValue => {
    setValue(newValue);
  };

  const onLoad = ace_ => {
    setAce(ace_);
    console.log(ace_)
  }

  const openPreview = () => {
    setPreview(epub.markdown2HTML(value));
  }

  const closePreview = () => {
    setPreview(null);
  }

  useEffect(() => {
    if (!isPreview && ace) {
      ace.textInput.focus();
    } 
  }, [preview])

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue])

  return (
    <div className="ee-md-editor-con">
      <div className="ee-md-editor">
        <MDToolBar
          ace={ace}
          isPreview={isPreview}
          screenshots={screenshots}
          defaultImage={defaultImage}
          openPreview={openPreview}
          closePreview={closePreview}
          onChooseImage={onChooseImage}
        />

        <div data-scroll className="ee-md-editor-preview" style={{height}}>
          {
            isPreview
            &&
            <MarkdownPreviewer value={preview} className="p-4" />
          }

          <MDTextArea
            id={id}
            value={value}
            height={height}
            onLoad={onLoad}
            onChange={onChange}
            isPreview={isPreview}
          />
        </div>
      </div>

      <ActionButtonGroup
        onSave={onSave}
        onClose={onClose}
      />
    </div>
  );
}
