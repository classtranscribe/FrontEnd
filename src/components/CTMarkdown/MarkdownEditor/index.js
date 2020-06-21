import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { html } from 'utils';
import { getAceShortcutHandler } from './ace/ace-shortcut';
import MarkdownPreviewer from '../MarkdownPreviewer';

import MDTextArea from './MDTextArea';
import MDToolBar from './MDToolBar';
import ActionButtonGroup from './ActionButtonGroup';
import './index.scss';

/**
 * A markdown editor built for ClassTranscribe
 */
function MarkdownEditor(props) {
  const {
    id,
    defaultValue = '',
    placeholder,
    height = '400px',
    imageTabs = [],
    defaultImage,
    onSave,
    onClose,
  } = props;

  const [value, setValue] = useState(defaultValue.trim() ? defaultValue : placeholder);
  const [ace, setAce] = useState(null);
  const [preview, setPreview] = useState(null);

  const isPreview = Boolean(preview);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  const onLoad = (ace_) => {
    setAce(ace_);
  };

  const handleSave = () => {
    const newText = ace.getValue();
    if (onSave) onSave(newText);
  };

  const openPreview = () => {
    setPreview(html.markdown(value));
  };

  const closePreview = () => {
    setPreview(null);
  };

  useEffect(() => {
    if (!isPreview && ace) {
      ace.textInput.focus();
    }
  }, [preview]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const toolBarProps = {
    ace,
    isPreview,
    imageTabs,
    defaultImage,
    openPreview,
    closePreview
  };

  const textareaProps = {
    id,
    value,
    height,
    isPreview,
    onLoad,
    onChange,
  };

  return (
    <div className="ct-md-editor-con">
      <div className="ct-md-editor" onKeyDown={getAceShortcutHandler(ace)}>
        <MDToolBar {...toolBarProps} />

        <div data-scroll className="ct-md-editor-preview" style={{ height }}>
          {isPreview && <MarkdownPreviewer value={preview} className="p-4" />}

          <MDTextArea {...textareaProps} />
        </div>
      </div>

      <ActionButtonGroup onSave={handleSave} onClose={onClose} />
    </div>
  );
}

MarkdownEditor.propTypes = {
  id: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  height: PropTypes.string,
  imageTabs: MDToolBar.propTypes.imageTabs,
  defaultImage: MDToolBar.propTypes.imageTabs,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
};

export default MarkdownEditor;