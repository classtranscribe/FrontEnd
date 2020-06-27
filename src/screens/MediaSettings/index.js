import React from 'react';
import { isMobile } from 'react-device-detect';
import { Route, Redirect } from 'react-router-dom';
import { links, api } from 'utils';
import { CTErrorWrapper, CTLayout } from 'layout';
import { setup, TAB_EPUB, TAB_EDIT_TRANS } from './controllers';

import { MSPHeaderTabTitle } from './Components';
import { EPub, Transcriptions } from './Tabs';

import withMSPReduxProvider from './controllers/msp-redux-provider';

import './index.scss';

class MediaSettingsWithRedux extends React.Component {
  constructor(props) {
    super(props);

    setup.verifyUser();

    this.mediaId = props.match.params.id;
    setup.init(props);
  }

  componentDidMount() {
    if (!isMobile) {
      setup.setupMedia(this.mediaId);
    } else {
      api.contentLoaded();
    }
  }

  getLayoutProps() {
    let mediaId = this.mediaId;
    let transPath = links.instMediaSettings(mediaId, TAB_EDIT_TRANS);
    let epubPath = links.instMediaSettings(mediaId, TAB_EPUB);

    return CTLayout.createProps({
      fill: true,
      transition: true,
      sidebarProps: {
        float: true,
      },
      headerProps: {
        shadowed: true,
        subtitle: 'Media Settings',
        tabTitleElem: <MSPHeaderTabTitle />,
        tabs: [
          {
            text: 'Transcriptions',
            active: window.location.pathname === transPath,
            href: transPath
          },
          {
            text: 'ePub',
            active: window.location.pathname === epubPath,
            href: epubPath
          }
        ]
      }
    });
  }

  render() {
    let mediaId = this.mediaId;

    let mspPath = links.instMediaSettings(mediaId);
    let transPath = links.instMediaSettings(mediaId, TAB_EDIT_TRANS);
    let epubPath = links.instMediaSettings(mediaId, TAB_EPUB);

    return isMobile ? (
      <div className="msp-bg">
        <CTErrorWrapper
          show
          navbar
          retry={false}
          signInButton={false}
          code={<i className="material-icons">laptop_mac</i>}
          header="Please open this page in a computer/laptop browser."
        />
      </div>
    ) : (
      <CTLayout {...this.getLayoutProps()}>
        <div className="msp-bg">

          <div className="msp-content">
            <Route exact path={mspPath} render={() => <Redirect to={transPath} />} />

            <Route path={epubPath} component={EPub} />

            <Route path={transPath} component={Transcriptions} />
          </div>
        </div>
      </CTLayout>
    );
  }
}

export const MediaSettings = withMSPReduxProvider(MediaSettingsWithRedux);
