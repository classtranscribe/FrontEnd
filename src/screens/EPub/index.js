import React, { useEffect } from 'react';
import { CTFragment, altEl, makeEl } from 'layout';
import { connect } from 'dva'
import { ARRAY_INIT } from 'utils/constants';
import * as KeyCode from 'keycode-js';
import { epub as epubController } from './controllers';
import Constants from './controllers/constants/EPubConstants';
import {
  EPubHeader,
  PlayerModal,
  PreviewModal,
  ShortcutModal,
  EPubFileInfoModal,
  ImagePickerModal
} from './components';
import { EditEPubStructure, EditEPubChapter, ViewAndDownload, EditINote } from './views';
import './index.scss';

function shouldDisable() {
  const activeEl = document.activeElement;
  return activeEl.getAttribute('contenteditable')
    || activeEl.tagName === 'input'
    || activeEl.tagName === 'textarea';
}

function EPubWithRedux({ view, chapters, epub, dispatch }) {
  const loading = chapters === ARRAY_INIT || epub === null;
  const headerElement = altEl(EPubHeader, !loading);

  const editStructView = altEl(EditEPubStructure, view === epubController.const.EpbEditStructure);
  const editChapterView = altEl(EditEPubChapter, view === epubController.const.EpbEditChapter);
  const readOnlyView = altEl(ViewAndDownload, view === epubController.const.EpbReadOnly);
  const editINoteView = altEl(EditINote, view === epubController.const.EditINote);

  const previewModal = makeEl(PreviewModal);
  const shortcutModal = makeEl(ShortcutModal);
  const fileSettingsModal = makeEl(EPubFileInfoModal);
  useEffect(() => {
    setTimeout(() => document.getElementById('ct-epb-main').focus(), 1000)
  }, [])
  /*
  onUndo(e) {
    this.preventDefault(e);
    if (epubState.view !== Constants.EpbReadOnly && epubData.history.canUndo) {
    epubData.history.undo(); NOT IMPLEMENTED
    }
  }

  onRedo(e) {
    this.preventDefault(e);
    if (epubState.view !== Constants.EpbReadOnly && epubData.history.canRedo) {
      epubData.history.redo();
    }
  }
  */

  const onKeyDown = (e) => {
    const { keyCode, metaKey, shiftKey } = e;
    if (shouldDisable()) {
      return;
    }

    if (!metaKey) return;
    // Meta key actions
    switch (keyCode) {
      case KeyCode.KEY_1: // 1
      case KeyCode.KEY_2: // 2
      case KeyCode.KEY_3: // 3
        e.preventDefault();
        return dispatch({ type: 'epub/setView', payload: (Constants.EPubViews[keyCode - 49]) })
      case KeyCode.KEY_B: // b
        e.preventDefault();
        return dispatch({ type: 'epub/toggleNav' })
      case KeyCode.KEY_S: // s
        e.preventDefault();
        return dispatch({ type: 'epub/updateEPub_Internal' })
      case KeyCode.KEY_Z: // z
        return // this.onUndo(event);
      case KeyCode.KEY_SLASH: // Slash
        e.preventDefault();
        return dispatch({ type: 'epub/toggleShortcuts' })
      default:
        break;
    }

    if (!shiftKey) return;
    // Shift + Meta key actions
    switch (keyCode) {
      case KeyCode.KEY_P: // p
        e.preventDefault();
        return dispatch({ type: 'epub/togglePreview' })
      case KeyCode.KEY_Z: // z
        e.preventDefault();
        return 0// this.onRedo(event);
      default:
        break;
    }
  }

  return (
    <CTFragment as="main" id={epubController.id.EPubMainID} loading={loading} onKeyDown={onKeyDown} tabIndex="0">
      {headerElement}

      <CTFragment id="ct-epb-view-con">
        {editINoteView}
        {editStructView}
        {editChapterView}
        {readOnlyView}
      </CTFragment>

      <ImagePickerModal />
      <PlayerModal />
      {previewModal}
      {shortcutModal}
      {fileSettingsModal}
    </CTFragment>
  );
}

export const EPub = connect(({ epub: { view, chapters, epub }, loading }) => ({
  view, chapters, epub
}))(EPubWithRedux);

