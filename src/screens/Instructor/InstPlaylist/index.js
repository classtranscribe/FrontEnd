import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'layout';
import { InfoAndListLayout } from 'components';
import { links } from 'utils';
import { instPlaylistStore, connectWithRedux, setup } from './controllers';
import {
  PlaylistInfo,
  MediaList,
  Confirmation,
  UploadFiles
} from './components';

export class InstPlaylistWithRedux extends Component {
  constructor(props) {
    super(props);
    setup.init(props);
  }

  componentDidMount() {
    const playlistId = this.props.match.params.id;
    setup.setupInstPlaylistPage(playlistId, this.props.location.state);
  }

  componentDidUpdate() {
    const { offering, playlist } = this.props;
    if (playlist && offering && playlist.id && offering.id) {
      links.title(`${playlist.name} | ${offering.fullNumber}`);
    }
  }

  render() {
    const { offering, confirmation, playlist } = this.props;
    const layoutProps = CTLayout.createProps((sidebar) => ({
      transition: true,
      responsive: true,
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      }
    }));

    return (
      <CTLayout {...layoutProps}>
        <InfoAndListLayout loading={!playlist.id}>
          <PlaylistInfo />
          <MediaList />
          {confirmation && <Confirmation />}

          <Route path="/playlist/:id/upload-files" component={UploadFiles} />
        </InfoAndListLayout>
      </CTLayout>
    )
  }
}

export const InstPlaylist = withReduxProvider(
  InstPlaylistWithRedux,
  instPlaylistStore,
  connectWithRedux,
  ['offering', 'confirmation', 'playlist'],
  ['all']
);
