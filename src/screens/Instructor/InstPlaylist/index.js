import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTLoadable } from 'layout';
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

  componentWillUnmount() {
    setup.clearData();
  }

  render() {
    const { offering, confirmation } = this.props;
    const layoutProps = CTLayout.createProps((sidebar) => ({
      transition: true,
      responsive: true,
      footer: true,
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      }
    }));

    return (
      <CTLayout {...layoutProps}>
        <CTLoadable loading={!offering.id}>
          <PlaylistInfo />
          <MediaList />
          {confirmation && <Confirmation />}
        </CTLoadable>
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
