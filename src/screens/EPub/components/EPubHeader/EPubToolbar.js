import React from 'react';
import ToolButton, { ToolButtonDivider } from './ToolButton';
import { CTFragment, altEl } from 'layout';

const _makeTBtn = (icon, label, shortcut, onClick, use, otherProps) =>
  altEl(ToolButton, use, { icon, onClick, shortcut, label, ...otherProps });

function EPubToolbar() {
  const undoBtnEl = _makeTBtn('undo', 'Undo', '⌘Z', null, true);
  const redoBtnEl = _makeTBtn('redo', 'Redo', '⌘⇧Z', null, true);
  const saveBtnEl = _makeTBtn('cloud_upload', 'Save', '⌘S', null, true);
  const previewBtnEl = _makeTBtn('preview', 'Preview ePub', '⌘⇧P', null, true);
  const prefBtnEl = _makeTBtn('tune', 'Preference', 'XXX', null, true);
  const shortcutBtnEl = _makeTBtn('keyboard', 'Shortcuts', 'XXX', null, true);
  const downloadBtnEl = _makeTBtn('', 'Download', '⌘D', null, true, {
    'aria-haspopup': true
  });

  return (
    <CTFragment id="ct-epb-header-toolbar" justConBetween>
      <CTFragment alignItCenter className="ct-epb tool-btns">
        {saveBtnEl}
        {previewBtnEl}
        <ToolButtonDivider />
        {downloadBtnEl}
        <ToolButtonDivider />
        {undoBtnEl}
        {redoBtnEl}
        <ToolButtonDivider />
        {prefBtnEl}
        {shortcutBtnEl}
      </CTFragment>
    </CTFragment>
  );
}

export default EPubToolbar;
