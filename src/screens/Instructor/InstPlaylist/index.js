import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'layout';
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
        <CTFragment id="cp-container" loading={!offering.id}>
          <CTFragment list id="cp-course-info" data-scroll>
            <PlaylistInfo />
          </CTFragment>

          <CTFragment id="cp-playlists">
            <MediaList />
          </CTFragment>

          {confirmation && <Confirmation />}
        </CTFragment>
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
