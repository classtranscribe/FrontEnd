import React from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTFragment, altEl, makeEl } from 'layout';
import { connect } from 'dva'
import { epub as epubController } from './controllers';
import {
  EPubHeader,
  PlayerModal,
  PreviewModal,
  ShortcutModal,
  EPubFileInfoModal,
  ImagePickerModal
} from './components';
import { EditEPubStructure, EditEPubChapter, ViewAndDownload } from './views';
import './index.scss';

class EPubWithRedux extends React.Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    epubController.ctrl.loadEPubPageData(id);
  }

  componentWillUnmount() {
    epubController.shortcut.removeKeydownListener();
  }

  render() {
    const { view, chapters, imgPickerData, playerData, media } = this.props.epub;
    const loading = epubController.ctrl.isLoading(this.props.epub, chapters);
    const headerElement = altEl(EPubHeader, !loading);

    const editStructView = altEl(EditEPubStructure, view === epubController.const.EpbEditStructure);
    const editChapterView = altEl(EditEPubChapter, view === epubController.const.EpbEditChapter);
    const readOnlyView = altEl(ViewAndDownload, view === epubController.const.EpbReadOnly);

    const imgPickerModal = altEl(ImagePickerModal, Boolean(imgPickerData), {
      imgPickerData, media
    });

    const playerModal = makeEl(PlayerModal, {
      ...playerData, open: Boolean(playerData) && media, media
    });
    
    const previewModal = makeEl(PreviewModal);
    const shortcutModal = makeEl(ShortcutModal);
    const fileSettingsModal = makeEl(EPubFileInfoModal);

    return (
      <CTFragment as="main" id={epubController.id.EPubMainID} loading={loading}>
        {headerElement}

        <CTFragment id="ct-epb-view-con">
          {editStructView}
          {editChapterView}
          {readOnlyView}
        </CTFragment>

        {imgPickerModal}
        {playerModal}
        {previewModal}
        {shortcutModal}
        {fileSettingsModal}
      </CTFragment>
    );
  }
}

export const EPub = connect(({ epub, loading }) => ({
  epub
}))(EPubWithRedux);

