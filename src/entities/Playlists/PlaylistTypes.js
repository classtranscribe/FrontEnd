class PlaylistTypes {
  static Echo360ID = 0
  static YouTubeID = 1
  static UploadID = 2
  static KalturaID = 3
  static BoxID = 4

  static Echo360RegEx = /https:\/\/echo360.org\/section\/[\s\S]*\/public/
  static YouTubeRegEx = /https:\/\/www.youtube.com\/(?:playlist\?list=|channel\/)([^/]*)/
  static KalturaRegEx = /https:\/\/mediaspace.illinois.edu\/(playlist(\/[\s\S]*\/|\/[\s\S]*\/[0-9]*\/|\/)[0-9]_[\s\S]+|channel(\/[\s\S]*\/|\/)[0-9]{9})/
  static BoxRegEx = /https:\/\/[\s\S]*box.com[\s\S]*\/folder\/[0-9]*/

  static get Echo360() {
    return {
      id: PlaylistTypes.Echo360ID,
      name: 'Echo360',
      description: 'Host videos from your Echo360 channels.',
      urlRegEx: PlaylistTypes.Echo360RegEx
    };
  }

  static get YouTube() {
    return {
      id: PlaylistTypes.YouTubeID,
      name: 'YouTube',
      description: 'Host videos from your YouTube playlists or channels.',
      urlRegEx: PlaylistTypes.YouTubeRegEx
    };
  }

  static get Upload() {
    return {
      id: PlaylistTypes.UploadID,
      name: 'Upload',
      description: 'Manually upload videos'
    };
  }

  static get Kaltura() {
    return {
      id: PlaylistTypes.KalturaID,
      name: 'Kaltura',
      description: 'Host videos from your Kaltura/MediaSpace playlists or channels.',
      urlRegEx: PlaylistTypes.KalturaRegEx
    };
  }

  static get MediaSpace() {
    return PlaylistTypes.Kaltura;
  }

  static get Box() {
    return {
      id: PlaylistTypes.BoxID,
      name: 'Box',
      description: 'Host videos from Box folders.',
      urlRegEx: PlaylistTypes.BoxRegEx
    };
  }

  static get All() {
    return [
      PlaylistTypes.Upload,
      PlaylistTypes.Echo360,
      PlaylistTypes.YouTube,
      PlaylistTypes.Kaltura,
      PlaylistTypes.Box
    ];
  }

  static get(typeId) {
    switch (typeId) {
      case PlaylistTypes.UploadID:
        return PlaylistTypes.Upload;

      case PlaylistTypes.Echo360ID:
        return PlaylistTypes.Echo360;

      case PlaylistTypes.YouTubeID:
        return PlaylistTypes.YouTube;

      case PlaylistTypes.KalturaID:
        return PlaylistTypes.Kaltura;

      case PlaylistTypes.BoxID:
        return PlaylistTypes.Box;
      default:
        return null
    }
  }

  static isValidUrl(typeId, url) {
    const type = PlaylistTypes.get(typeId);
    if (!type) return false;
    if (!type.urlRegEx) return true;

    return type.urlRegEx.test(url);
  }

  static isKalturaChannel(url) {
    if (!PlaylistTypes.isValidUrl(PlaylistTypes.KalturaID, url)) {
      return false;
    }

    return url.includes('/channel/');
  }

  static getIdentifier(typeId, url) {
    if (!PlaylistTypes.isValidUrl(typeId, url)) return null;

    if (typeId === PlaylistTypes.YouTubeID) {
      return url.match(PlaylistTypes.YouTubeRegEx)[1];
    } if (typeId === PlaylistTypes.BoxID) {
      return url.split('/folder/')[1];
    } if (typeId === PlaylistTypes.KalturaID) {
      const isChannel = PlaylistTypes.isKalturaChannel(url);
      const idRegEx = isChannel ? /[0-9]{9}/ : /[0-9]_[\s\S]+/;
      const id = url.slice(url.search(idRegEx)).split('/')[0];
      const type = isChannel ? 'channel' : 'playlist';
      return `https://mediaspace.illinois.edu/${type}/${id}`;
    }

    return url;
  }
}

export default PlaylistTypes;