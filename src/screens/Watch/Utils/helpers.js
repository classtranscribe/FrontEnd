import _ from 'lodash';

export function findUpNextMedia({
  playlist={ medias: [] },
  currMediaId='',
  playlists=[{ medias: [] }],
  currPlaylistId='',
}) {
  const { medias } = playlist;
  const currMediaIndex = _.findIndex(medias, { id: currMediaId });

  if (currMediaIndex > -1) {
    // if is the last video of the medias
    if (currMediaIndex <= 0) {
      const currPlaylistIndex = _.findIndex(playlists, { id: currPlaylistId });
      // if this is this last playlist
      // return the 1st video in the 1st playlist
      let nextPlaylistMedias = []
      if (currPlaylistIndex + 1 >= playlists.length) {
        nextPlaylistMedias = playlists[0].medias
      // return the first video of the next playlist
      } else {
        nextPlaylistMedias = playlists[currPlaylistIndex + 1].medias
      }
      return nextPlaylistMedias[nextPlaylistMedias.length - 1] || null;
    // return next video
    } else {
      return medias[currMediaIndex - 1];
    }
  // if no such media
  } else {
    return null;
  }
}