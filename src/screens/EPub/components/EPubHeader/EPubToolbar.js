import React, { useState, useEffect } from 'react';
import { CTFragment } from 'layout';
import { epub, connectWithRedux } from '../../controllers';
import { ToolButtonDivider, _makeTBtn } from './ToolButton';
import DownloadDropdown from './DownloadDropdown';

function EPubToolbar({ view, chapters, ...props }) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    // invoke undo, redo status when content changes
    setCanUndo(epub.history.canUndo);
    setCanRedo(epub.history.canRedo);
  }, [chapters, props.epub]);

  const isReadOnly = view === epub.const.EpbReadOnly;

  const undoBtnEl = _makeTBtn(
    'undo', 'Undo', '⌘Z', epub.data.history.undo, false, !isReadOnly, 
    { disabled: !canUndo }
  );
  const redoBtnEl = _makeTBtn(
    'redo', 'Redo', '⌘⇧Z', epub.data.history.redo, false, !isReadOnly,
    { disabled: !canRedo }
  );

  const saveEPub = () => epub.data.saveEPub(0);
  const saveBtnEl = _makeTBtn('cloud_upload', 'Save', '⌘S', saveEPub, false, true);

  const openPreview = () => epub.state.setShowPreview(true);
  const previewBtnEl = _makeTBtn(
    'preview', 'Preview ePub', '⌘⇧P', openPreview, false, !isReadOnly
  );

  const prefBtnEl = _makeTBtn('tune', 'Preference', 'XXX', null, false, true);
  const shortcutBtnEl = _makeTBtn('keyboard', 'Shortcuts', 'XXX', null, false, true);
  

  return (
    <CTFragment id="ct-epb-header-toolbar" justConBetween>
      <CTFragment alignItCenter className="ct-epb tool-btns">
        {saveBtnEl}
        {previewBtnEl}
        <ToolButtonDivider />
        <DownloadDropdown />
        {!isReadOnly && <ToolButtonDivider />}
        {undoBtnEl}
        {redoBtnEl}
        <ToolButtonDivider />
        {prefBtnEl}
        {shortcutBtnEl}
      </CTFragment>
    </CTFragment>
  );
}

export default connectWithRedux(
  EPubToolbar,
  ['view', 'chapters', 'epub']
);
