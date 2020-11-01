import React from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTFragment, altEl, makeEl } from 'layout';
import { epubStore, connectWithRedux, epub } from './controllers';
import {
  EPubHeader,
  PlayerModal,
  PreviewModal,
  EPubFileInfoModal,
  ImagePickerModal
} from './components';
import { EditEPubStructure, EditEPubChapter, ViewAndDownload } from './views';
import './index.scss';

class EPubWithRedux extends React.Component {
  constructor(props) {
    super(props)
    epub.state.init(props);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    epub.ctrl.loadEPubPageData(id);
  }

  render() {
    const { view, chapters, imgPickerData, playerData, media } = this.props;
    const loading = epub.ctrl.isLoading(this.props.epub, chapters);
    const headerElement = altEl(EPubHeader, !loading);

    const editStructView = altEl(EditEPubStructure, view === epub.const.EpbEditStructure);
    const editChapterView = altEl(EditEPubChapter, view === epub.const.EpbEditChapter);
    const readOnlyView = altEl(ViewAndDownload, view === epub.const.EpbReadOnly);

    const imgPickerModal = altEl(ImagePickerModal, Boolean(imgPickerData), { imgPickerData, media });
    const playerModal = makeEl(PlayerModal, {
      ...playerData, open: Boolean(playerData) && media, media
    });
    const previewModal = makeEl(PreviewModal);
    const fileSettingsModal = makeEl(EPubFileInfoModal);

    return (
      <CTFragment as="main" id="ct-epb-main" loading={loading}>
        {headerElement}

        <CTFragment id="ct-epb-view-con">
          {editStructView}
          {editChapterView}
          {readOnlyView}
        </CTFragment>

        {imgPickerModal}
        {playerModal}
        {previewModal}
        {fileSettingsModal}
      </CTFragment>
    );
  }
}

export const EPub = withReduxProvider(
  EPubWithRedux,
  epubStore,
  connectWithRedux,
  ['epub', 'view', 'chapters', 'playerData', 'media', 'imgPickerData'],
  ['all']
);

