import React, { useState, useEffect } from 'react';
import { api, uurl } from 'utils';
import { CTPlayer, CTPlayerConstants as Constants } from 'components/CTPlayer';

/* 
Able to set begin time: beginAt
Able to set default open/close CC: defaultOpenCC
Able to set default language: language
Able to set default playback rate: playbackRate
*/

export function Embed() {
  const {
    id = "c9a54a76-9cf0-4ec2-ab2f-89d496326562",
    begin = 80,
    opencc = 'true',
    lang = Constants.SIMPLIFIED_CHINESE,
    playbackrate = Constants.PLAYBACK_RATES[0],
  } = uurl.useSearch();

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
        defaultOpenCC={opencc === 'true'}
        defaultLanguage={lang}
        defaultPlaybackRate={playbackrate}
      />
    </div>
  );
}