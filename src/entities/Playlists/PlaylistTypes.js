import { uurl } from 'utils/use-url';

class PlaylistTypes {
  static Echo360ID = 0
  static YouTubeID = 1
  static UploadID = 2
  static KalturaID = 3
  static MediaSpaceID = 3
  static BoxID = 4

  static Echo360RegEx = /https:\/\/echo360.org\/section\/[\s\S]*\/public/
  static YouTubeRegEx = /https:\/\/www.youtube.com\/playlist\?list=[\s\S]*/
  static KalturaRegEx = /https:\/\/mediaspace.illinois.edu\/(channel|playlist)(\/[\s\S]*\/|\/[\s\S]*\/[0-9]*\/|\/)[0-9]_[\s\S]+/
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
      description: 'Host videos from your YouTube playlists.',
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
      description: 'Host videos from your Kaltura/MediaSpace playlists.',
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

  static getIndentifier(typeId, url) {
    if (!PlaylistTypes.isValidUrl(typeId, url)) return null;

    if (typeId === PlaylistTypes.YouTubeID) {
      return uurl.useSearch(url).list;
    } if (typeId === PlaylistTypes.BoxID) {
      return url.split('/folder/')[1];
    } if (typeId === PlaylistTypes.KalturaID) {
      return url.slice(url.search(/[0-9]_[\s\S]/)).split('/')[0];
    }

    return url;
  }
}

export default PlaylistTypes;