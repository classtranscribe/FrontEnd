import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'layout';
import { InfoAndListLayout } from 'components';
import { instPlaylistStore, connectWithRedux, setup } from './controllers';
import {
  PlaylistInfo,
  MediaList,
  Confirmation
} from './components';

export class InstPlaylistWithRedux extends Component {
  constructor(props) {
    super(props);
    setup.init(props);
  }

  componentDidMount() {
    const playlistId = this.props.match.params.id;
    setup.setupInstPlaylistPage(playlistId);
  }

  // componentWillUnmount() {
  //   setup.clearData();
  // }

  render() {
    const { offering, confirmation } = this.props;
    const layoutProps = CTLayout.createProps((sidebar) => ({
      transition: true,
      responsive: true,
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      }
    }));

    return (
      <CTLayout {...layoutProps}>
        <InfoAndListLayout loading={!offering.id}>
          <PlaylistInfo />
          <MediaList />
          {confirmation && <Confirmation />}
        </InfoAndListLayout>
      </CTLayout>
    )
  }
}

export const InstPlaylist = withReduxProvider(
  InstPlaylistWithRedux,
  instPlaylistStore,
  connectWithRedux,
  ['offering', 'confirmation'],
  ['all']
);
