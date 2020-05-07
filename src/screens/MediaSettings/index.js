import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { util } from 'utils';
import { 
  setup,
  TAB_EPUB,
  TAB_EDIT_TRANS,
} from './Utils';
import withMSPReduxProvider from './Utils/msp-redux-provider';

import { MSPHeader } from './Components';
import { EPub } from './Tabs';

import './index.scss';


class MediaSettingsWithRedux extends React.Component {
  constructor(props) {
    super(props);

    setup.verifyUser();

    this.mediaId = props.match.params.id;
    setup.init(props);
  }

  componentDidMount() {
    setup.setupMedia(this.mediaId);
  }

  render() {
    let mediaId = this.mediaId;

    let mspPath = util.links.instMediaSettings(mediaId);
    let transPath = util.links.instMediaSettings(mediaId, TAB_EDIT_TRANS);
    let epubPath = util.links.instMediaSettings(mediaId, TAB_EPUB);

    return (
      <div className="msp-bg">
        <MSPHeader />

        <div className="msp-content">
          <Route exact
            path={mspPath} 
            render={() => <Redirect to={transPath} />}   
          />

          <Route path={epubPath} component={EPub} />

          {/* <Route path={transPath} component={} /> */}
        </div>
      </div>
    );
  }
}

export const MediaSettings = withMSPReduxProvider(MediaSettingsWithRedux);