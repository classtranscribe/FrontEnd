import React, { useState, useEffect } from 'react';
import { uurl } from 'utils/use-url'
import { api } from 'utils'
import { CTPlayer } from 'components/CTPlayer';
import { CTPlayerConstants as Constants, CTPlayerController } from 'components/CTPlayer/controllers';

/* 
Able to set begin time: beginAt
Able to set default open/close CC: defaultOpenCC
Able to set default language: language
Able to set default playback rate: playbackRate
*/

export function Embed() {
  const {
    id = "c9a54a76-9cf0-4ec2-ab2f-89d496326562",
    begin = 100,
    opencc = 'false',
    language = {
      code: Constants.SIMPLIFIED_CHINESE,
      text: Constants.LANG_MAP[Constants.SIMPLIFIED_CHINESE]
    },
    playbackRate = Constants.PLAYBACK_RATES[0],
  } = uurl.useSearch();

  useEffect(() => {
    api.contentLoaded()
  }, [])

  return (
    <div>
      <CTPlayer
        mediaId={id}
        fill
        allowTwoScreen
        beginAt={parseInt(begin, 10)}
        openCC={opencc === 'true'}
        allowRangePicker={false}
        language="zh-Hans"
        playbackRate={playbackRate}
      />
    </div>
  )
}