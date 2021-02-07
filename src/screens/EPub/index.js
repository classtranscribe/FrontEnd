import React from 'react';
import { CTFragment, altEl, makeEl } from 'layout';
import { connect } from 'dva'
import { ARRAY_INIT } from 'utils/constants';
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
  componentWillUnmount() {
    epubController.shortcut.removeKeydownListener();
  }
  componentDidMount() {
    epubController.data.setDispatch(this.props.dispatch)
  }

  render() {
    const { view, chapters, epub } = this.props;
    const loading = chapters === ARRAY_INIT || epub === null; 
    const headerElement = altEl(EPubHeader, !loading);

    const editStructView = altEl(EditEPubStructure, view === epubController.const.EpbEditStructure);
    const editChapterView = altEl(EditEPubChapter, view === epubController.const.EpbEditChapter);
    const readOnlyView = altEl(ViewAndDownload, view === epubController.const.EpbReadOnly);
    
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

        <ImagePickerModal />
        <PlayerModal />
        {previewModal}
        {shortcutModal}
        {fileSettingsModal}
      </CTFragment>
    );
  }
}

export const EPub = connect(({ epub : {view, chapters, epub} , loading }) => ({
  view, chapters, epub
}))(EPubWithRedux);

