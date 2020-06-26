import React, { useState, useEffect } from 'react';
import { uurl } from 'utils/use-url'
import { api } from 'utils'
import { CTPlayer } from 'components/CTPlayer';
import { CTFragment, CTLayout } from 'layout';
import { CTPlayerConstants as Constants } from 'components/CTPlayer/controllers';
import { Example } from '../Example'

/* 
Able to set begin time: beginAt
Able to set default open/close CC: defaultOpenCC
Able to set default language: language
Able to set default playback rate: playbackRate
*/

export function Embed() {
    const {
        id = "",
        begin = 100,
        opencc = 'true',
        language = {
            code: Constants.ENGLISH,
            text: Constants.LANG_MAP[Constants.ENGLISH]
        },
        playbackRate,
    } = uurl.useSearch();

    useEffect(() => {
        api.contentLoaded()
    }, [])

    return (
      <div>
        <CTPlayer
          mediaId={id}
          fill={false}
          allowTwoScreen
          beginAt={parseInt(begin, 10)}
          defaultOpenCC={opencc === 'true'}
          allowRangePicker={false}
          language="French"
          playbackRate={1.5}
        />
      </div>
    )
}
