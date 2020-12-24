import { api, links } from "utils";

export function parseMedia(mediaLike) {
  let media = mediaLike;
  if (!media.mediaName) {
    media = api.parseMedia(media);
  }

  return {
    key: media.id,
    id: media.id,
    name: media.mediaName,
    ratio: media.watchHistory.ratio,
    href: links.watch(media.id),
    isUnavailable: media.isUnavailable,
    duration: media.duration
  };
}