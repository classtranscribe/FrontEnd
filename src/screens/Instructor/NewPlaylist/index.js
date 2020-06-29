import React, { Component } from 'react';
import { CTLayout } from 'layout';
import { api, prompt, links } from 'utils';
import { NewPlaylistForm } from './Components';

export class NewPlaylist extends Component {
  componentDidMount() {
    api.contentLoaded();
  }

  onSave = async (newPlayList) => {
    const { playlistName, sourceType, url } = newPlayList;
    let playlistId = null;
    const offeringId = this.props.match.params.offeringId;
    try {
      // console.log(playlistName);
      // console.log(sourceType);
      // console.log(url);
      const { data } = await api.createPlaylist({
        offeringId,
        name: 'hhh',
        sourceType: 2,
        // playlistIdentifier: '',
      });
      playlistId = data.id;
    } catch (e) {
      prompt.error('Failed to create the new playlist.');
      return;
    }
    prompt.addOne(
      {
        text: 'NewPlaylist Created.',
        header: 'Success',
        status: 'success',
        timeout: 2200,
        position: 'top',
        offset: [-1, -1],
      },
      false,
    );
    if (playlistId) {
      this.props.history.push(links.history());
    }
  };

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Playlist',
        icon: 'add',
        sticky: true,
        gradient: true,
        offsetTop: 30,
      },
    });

    return (
      <CTLayout {...layoutProps}>
        <NewPlaylistForm onSave={this.onSave} />
      </CTLayout>
    );
  }
}
