import React, { useState, useEffect, useContext } from 'react';
import { CTFragment, CTFormHeading, CTFormRow, CTInput, CTSelect, CTCheckbox , CTForm } from 'layout';
import { api, util, user } from 'utils';
import PlaylistType from './PlaylistSelection';
import PlaylistName from './PlaylistName';

export function NewPlaylistForm() {
  //   componentDidMount() {
  //     api.contentLoaded();
  //   }

  // //   render() {
  // //     const layoutProps = CTLayout.createProps({
  // //       transition: true,
  // //       responsive: true,
  // //       footer: true,
  // //       headingProps: {
  // //         heading: 'Playlist',
  // //         icon: 'list',
  // //         sticky: true,
  // //         gradient: true,
  // //         offsetTop: 30,
  // //       },
  //     });

  return (
    <CTForm
      heading="Playlist"
      padding={[10, 35]}
      id="ctform-basics"
      details="Create a new Playlist"
    >
      <PlaylistName />
      <PlaylistType />
    </CTForm>
  );
}
