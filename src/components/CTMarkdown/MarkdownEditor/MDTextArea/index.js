import React from 'react';
import PropsTypes from 'prop-types';
import cx from 'classnames';
import AceEditor from 'react-ace';
import './index.scss';

import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/snippets/markdown';

function AceTextArea(props) {
  const {
    id = '',
    value = '',
    height = '400px',
    isPreview = false,
    onLoad,
    onFocus,
    onChange,
    onCursorChange
  } = props;

  const style = cx('ct-md-textarea-con', { preview: isPreview });

  return (
    <div className={style}>
      <AceEditor
        focus
        wrapEnabled
        highlightActiveLine
        enableLiveAutocompletion
        enableBasicAutocompletion
        className="ct-md-textarea"
        showGutter={false}
        name={`ace-md-${id}`}
        mode="markdown"
        theme="xcode"
        value={value}
        cursorStart={0}
        fontSize={13}
        width="100%"
        height={height}
        onLoad={onLoad}
        onFocus={onFocus}
        onChange={onChange}
        onCursorChange={onCursorChange}
      />
    </div>
  );
}

AceTextArea.propTypes = {
  id: PropsTypes.string,
  value: PropsTypes.string,
  height: PropsTypes.string,
  isPreview: PropsTypes.bool,
  onLoad: PropsTypes.func,
  onFocus: PropsTypes.func,
  onChange: PropsTypes.func,
  onCursorChange: PropsTypes.func,
};

export default AceTextArea;
