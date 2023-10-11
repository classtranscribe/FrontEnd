import React, { useState, useEffect } from 'react';
import { CTFragment } from 'layout';
import { epub as EPubController, connectWithRedux, generateEPubGuide } from '../../controllers';
import { ToolButtonDivider, _makeTBtn } from './ToolButton';
import DownloadDropdown from './DownloadDropdown';

function EPubToolbar({ view, dispatch, epub }) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const { chapters = [] } = epub;
  useEffect(() => {
    // invoke undo, redo status when content changes
    setCanUndo(EPubController.history.canUndo);
    setCanRedo(EPubController.history.canRedo);
  }, [chapters, epub]);
  const historyUndo = () => {
    // NOT IMPLEMENTED
  }
  const historyRedo = () => {
    // NOT IMPLEMENTED
  }
  const isReadOnly = view === EPubController.const.EpbReadOnly;

  const undoBtnEl = _makeTBtn(
    'undo', 'Undo', '⌘Z', historyUndo, false, !isReadOnly,
    { disabled: !canUndo }
  );
  const redoBtnEl = _makeTBtn(
    'redo', 'Redo', '⌘⇧Z', historyRedo, false, !isReadOnly,
    { disabled: !canRedo }
  );

  const saveEPub = () => dispatch({ type: 'epub/updateEPub_Internal' })
  const saveBtnEl = _makeTBtn('cloud_upload', 'Save', '⌘S', saveEPub, false, true);

  const openPreview = () => dispatch({ type: 'epub/setShowPreview', payload: true });
  const previewBtnEl = _makeTBtn(
    'preview', 'Preview I-Note', '⌘⇧P', openPreview, false, !isReadOnly 
  );

  const prefBtnEl = null// _makeTBtn('tune', 'Preference', null, null, false, true);

  const openShortcuts = () => dispatch({ type: 'epub/setShowShortcuts', payload: true });
  const shortcutBtnEl = _makeTBtn(
    'keyboard', 'Keyboard Shortcuts', '⌘/', openShortcuts, false, true
  );

  const openHelpGuide = () => {
    const guide = generateEPubGuide(true);
    guide.start();
  };
  const guideBthEl = _makeTBtn(
    'help_outline', 'Show Help Guide', null, openHelpGuide, false, true
  );

  const onOpenSettings = () => dispatch({ type: 'epub/setShowFileSettings', payload: true });

  const settingsBtn = _makeTBtn(
    'edit', 'Edit I-Note Info', null, onOpenSettings, false, true
  );

  return (
    <CTFragment id="ct-epb-header-toolbar" justConBetween>
      <CTFragment alignItCenter className="ct-epb tool-btns">
        {null && previewBtnEl} {/* The preview button causes a crash when clicked (cause unknown) */}
        {settingsBtn}
        <ToolButtonDivider />
        <DownloadDropdown />
        {!isReadOnly && <ToolButtonDivider />}
        {null && undoBtnEl}
        {null && redoBtnEl}
        {null && <ToolButtonDivider />}
        {prefBtnEl}
        {shortcutBtnEl}
        {guideBthEl}
      </CTFragment>
    </CTFragment>
  );
}
// NOT IMPLEMENTED

export default connectWithRedux(
  EPubToolbar,
  ['view', 'epub']
);
