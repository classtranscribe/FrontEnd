import PlaylistTypes from 'entities/Playlists/PlaylistTypes';

export function epubIsText(content) {
  return typeof content === 'string' || (typeof content === 'object' && 'text' in content);
}

export function epubIsImage(content) {
  return typeof content === 'object' && 'src' in content;
}

export function getSourceLink(sourceId, sourceType, timestamp) {
  const [hour, minutes, seconds] = timestamp.split(':').map(parseFloat);
  let time_in_seconds = hour * 3600 + minutes * 60 + seconds;
  time_in_seconds = Math.floor(time_in_seconds);
  if (sourceType === PlaylistTypes.YouTubeID) {
    return `https://www.youtube.com/watch?v=${sourceId}&t=${time_in_seconds}s`;
  }
  if (sourceType === PlaylistTypes.KalturaID) {
    return `https://mediaspace.illinois.edu/media/${sourceId}?st=${time_in_seconds}`;
  }
  if (sourceType === PlaylistTypes.BoxID) {
    return sourceId;
  }
  return null;
}
