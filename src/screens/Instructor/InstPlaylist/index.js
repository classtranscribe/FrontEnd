import React from 'react';
import { connect } from 'react-redux';
import { CTLayout, CTErrorWrapper, altEl } from 'layout';
import { InfoAndListLayout } from 'components';
import ErrorTypes from 'entities/ErrorTypes';
import { Outlet } from 'react-router-dom';
import {
  PlaylistInfo,
  MediaList,
  Confirmation,
  UploadFiles
} from './components';

// export class InstPlaylistWithRedux extends Component {
export const InstPlaylistWithRedux = (props) => {
  const { instplaylist, dispatch } = props;
  const { offering, confirmation, playlist } = instplaylist;
  const layoutProps = CTLayout.createProps((sidebar) => ({
    transition: true,
    responsive: true,
    sidebarProps: {
      items: sidebar.getCoursePageSidebarItems(offering)
    },
    headerProps: {
      subtitle: 'Course Admin'
    }
  }));

  // Handle meta tags
  if (playlist && playlist.id && offering && offering.id) {
    let metaTitle = `${playlist.name} | ${offering.fullNumber}`;

    if (window.location.pathname.includes('/upload-files')) {
      metaTitle = `Upload Videos | ${metaTitle}`;
    }

    layoutProps.metaTagsProps = { title: metaTitle };
  }

  const hasError = ErrorTypes.isError(playlist);
  const errorElement = altEl(CTErrorWrapper, hasError, { show: true, ...playlist });

  return (
    <CTLayout {...layoutProps}>
      <InfoAndListLayout loading={!playlist.id} error={hasError} errorElement={errorElement}>
        <PlaylistInfo {...props} />
        <MediaList />
        {confirmation && <Confirmation confirmation={confirmation} onClose={() => dispatch({ type: 'instplaylist/setConfirmation', payload: null })} />}

        <Outlet />
      </InfoAndListLayout>
    </CTLayout>
  )
}


export const InstPlaylist = connect(({ instplaylist }) => ({
  instplaylist
}))(InstPlaylistWithRedux);