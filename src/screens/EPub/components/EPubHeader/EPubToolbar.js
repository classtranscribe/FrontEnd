import React from 'react';
import ToolButton, { ToolButtonDivider } from './ToolButton';
import { CTFragment, altEl } from 'layout';

const _makeTBtn = (icon, label, shortcut, onClick, active, use, otherProps) =>
  altEl(ToolButton, use, { icon, onClick, shortcut, label, active, ...otherProps });

function EPubToolbar() {
  const undoBtnEl = _makeTBtn('undo', 'Undo', '⌘Z', null, false, true);
  const redoBtnEl = _makeTBtn('redo', 'Redo', '⌘⇧Z', null, false, true);
  const saveBtnEl = _makeTBtn('cloud_upload', 'Save', '⌘S', null, false, true);
  const previewBtnEl = _makeTBtn('preview', 'Preview ePub', '⌘⇧P', null, false, true);
  const prefBtnEl = _makeTBtn('tune', 'Preference', 'XXX', null, false, true);
  const shortcutBtnEl = _makeTBtn('keyboard', 'Shortcuts', 'XXX', null, false, true);
  const downloadBtnEl = _makeTBtn('', 'Download', '⌘D', null, false, true, {
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
