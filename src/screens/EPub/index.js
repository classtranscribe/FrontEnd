import React from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTFragment, altEl } from 'layout';
import { epubStore, connectWithRedux, epub } from './controllers';
import { EPubHeader } from './components';
import './index.scss';

class EPubWithRedux extends React.Component {
  constructor(props) {
    super(props)
    epub.state.init(props);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    epub.ctrl.setEPubPage(id);
  }

  render() {
    const loading = this.props.epub === null;
    const headerElement = altEl(EPubHeader, !loading);

    return (
      <CTFragment as="main" id="ct-epb-main" loading={loading}>
        {headerElement}
      </CTFragment>
    );
  }
}

export const EPub = withReduxProvider(
  EPubWithRedux,
  epubStore,
  connectWithRedux,
  ['epub'],
  ['all']
);

