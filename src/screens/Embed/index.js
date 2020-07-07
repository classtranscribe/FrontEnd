import React, { useEffect } from 'react';
import { api, uurl } from 'utils';
import { CTPlayer, CTPlayerConstants as Constants } from 'components/CTPlayer';
import { useParams } from "react-router-dom";

/* 
Set begin time in second: begin
Set default open/close CC: defaultOpenCC
Set default language: lang
Options: en-US, zh-Hans, ko, es, fr
Set default playback rate: playbackRate
0 for 2x speed, 1 for 1.75x, and so on. 4 for original speed (1x)
*/

export function Embed() {
  const {
    begin = 0,
    openCC = 'false',
    lang = Constants.ENGLISH,
    playbackrate = 4,
    padded = 'false'
  } = uurl.useSearch();
  // get video id from url
  // e.g. c9a54a76-9cf0-4ec2-ab2f-89d496326562
  let { id } = useParams()
  useEffect(() => {
    api.contentLoaded();
  }, []);

  return (
    <div className="w-100 h-100">
      <CTPlayer
        mediaId={id}
        fill
        allowTwoScreen
        hideWrapperOnMouseLeave
        beginAt={parseInt(begin, 10)}
        defaultOpenCC={openCC === 'true'}
        defaultLanguage={lang}
        defaultPlaybackRate={Constants.PLAYBACK_RATES[playbackrate]}
        padded={padded === 'true'}
      />
    </div>
  );
}