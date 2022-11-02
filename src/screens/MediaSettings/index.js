import React from 'react';
import { Route, Redirect } from 'dva/router';
import { links, api } from 'utils';
import { connect } from 'dva';
import { isMobile } from 'react-device-detect';
import { CTErrorWrapper, CTLayout } from 'layout';
import { TAB_EPUB, TAB_EDIT_TRANS } from './controllers/constants';
import { MSPHeaderTabTitle } from './Components';
import { EPub, Transcriptions } from './Tabs';
import './index.scss';

class MediaSettingsWithRedux extends React.Component {
  // setup.verifyUser();
  getLayoutProps() {
    const { mediasetting, match } = this.props;
    let mediaId = match.params.id;
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
        tabTitleElem: <MSPHeaderTabTitle {...this.props} />,
        tabs: [
          /* NOT IMPLEMENTED: WIP
          {
            text: 'Transcriptions',
            active: window.location.pathname === transPath,
            href: transPath
          },
          */
          {
            text: 'I-Note',
            active: window.location.pathname === epubPath,
            href: epubPath
          }
        ]
      }
    });
  }

  render() {
    const { mediasetting, match } = this.props;
    const mediaId = match.params.id;

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

export const MediaSettings = connect(({ mediasetting, loading }) => ({
  mediasetting
}))(MediaSettingsWithRedux);
