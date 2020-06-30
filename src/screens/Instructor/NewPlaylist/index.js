import React, { Component } from 'react';
import { CTLayout } from 'layout';
import { uurl, api, prompt, links } from 'utils';
import { NewPlaylistForm } from './Components';

export class NewPlaylist extends Component {
  componentDidMount() {
    api.contentLoaded();
  }

  isValidIdURL(sourceType, url = '') {
    if (sourceType === 2) return true;
    if (!url) return false;

    if (sourceType === 0) {
      // Echo360
      const reg = /https:\/\/echo360.org\/section\/[\s\S]*\/public/;
      return reg.test(url);
    }
    if (sourceType === 1) {
      // YouTube
      const { list } = uurl.useSearch(url);
      return Boolean(list);
    }
    if (sourceType === 3) {
      // Kaltura/MediaSpace
      const reg = /https:\/\/mediaspace.illinois.edu\/channel\/[\s\S]*\/[0-9]{1}/;
      return reg.test(url);
    }
    if (sourceType === 4) {
      // Box
      const reg = /https:\/\/[\s\S]*box.com[\s\S]*\/folder\/[0-9]{1}/;
      return reg.test(url);
    }

    return false;
  }

  onSave = async (newPlayList) => {
    const { name, sourceType, url } = newPlayList;
    let playlistId = null;
    const offeringId = this.props.match.params.offeringId;
    let playlistIdentifier = url;
    let playlistURL = url;

    // Check validity
    if (!offeringId || !name) return;
    if (!this.isValidIdURL(sourceType, url)) return;

    // extract url
    if (sourceType === 1) {
      // YouTube
      const { list } = uurl.useSearch(url);
      playlistIdentifier = list;
    } else if (sourceType === 3) {
      // Kaltura
      const items = url.split('/');
      playlistIdentifier = items[items.length - 1]; // the last one is the channel id
    } else if (sourceType === 4) {
      // Box
      playlistIdentifier = url.split('/folder/')[1]; // the 2nd one is the channel id
    }

    // set the `source` in the jsonMetadata to the source URL of this playlist
    const jsonMetadata = playlistURL ? { source: playlistURL } : null;

    let newPl = {
      offeringId,
      name,
      sourceType,
      playlistIdentifier,
      jsonMetadata,
    };

    try {
      const { data } = await api.createPlaylist(newPl);
      newPl = data;
      playlistId = data.id;
    } catch (e) {
      console.error(e);
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
      this.props.history.push(links.offeringDetail(offeringId));
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
