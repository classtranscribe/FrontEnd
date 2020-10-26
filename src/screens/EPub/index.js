import React from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTFragment, altEl } from 'layout';
import { epubStore, connectWithRedux, epub } from './controllers';
import { EPubHeader } from './components';
import { EditEPubStructure } from './views';
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
    const { view, chapters } = this.props;
    const loading = epub.ctrl.isLoading(this.props.epub, chapters);
    const headerElement = altEl(EPubHeader, !loading);

    const editStructView = altEl(EditEPubStructure, view === epub.const.EpbEditStructure);
    const editChapterView = null;
    const readOnlyView = null;

    return (
      <CTFragment as="main" id="ct-epb-main" loading={loading}>
        {headerElement}

        <CTFragment id="ct-epb-view-con">
          {editStructView}
          {editChapterView}
          {readOnlyView}
        </CTFragment>
      </CTFragment>
    );
  }
}

export const EPub = withReduxProvider(
  EPubWithRedux,
  epubStore,
  connectWithRedux,
  ['epub', 'view', 'chapters'],
  ['all']
);

