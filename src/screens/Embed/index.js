import React, { useEffect } from 'react';
import { api, uurl } from 'utils';
import CTPlayer, {
  CTPlayerConstants as PConstants,
  LanguageConstants as LangConstants
} from 'components/CTPlayer';
import { useParams } from "dva/router";
import { connect } from 'dva';

/* 
Set begin time in second: begin
Set default open/close CC: defaultOpenCC
Set default language: lang
Options: en-US, zh-Hans, ko, es, fr
Set default playback rate: playbackRate
0 for 2x speed, 1 for 1.75x, and so on. 4 for original speed (1x)
*/

function EmbedWithRedux({ dispatch, match }) {
  const {
    begin = 0,
    openCC = 'false',
    lang = LangConstants.English,
    playbackRate = 4,
    padded = 'false',
    screenshot = 'false',
  } = uurl.useSearch();
  const { params } = match;
  // get video id from url
  // e.g. c9a54a76-9cf0-4ec2-ab2f-89d496326562
  // let { id } = useParams();

  return (
    <div className="w-100 h-100">
      <CTPlayer
        mediaId={params.id}
        fill
        allowTwoScreen
        allowScreenshot={screenshot === 'true'}
        hideWrapperOnMouseLeave
        beginAt={parseInt(begin, 10)}
        defaultOpenCC={openCC === 'true'}
        defaultLanguage={lang}
        defaultPlaybackRate={PConstants.PlaybackRates[playbackRate]}
        padded={padded === 'true'}
      />
    </div>
  );
}
export const Embed = connect(({
  playerpref: { openCC }
}) => ({
  openCC
}))(EmbedWithRedux);