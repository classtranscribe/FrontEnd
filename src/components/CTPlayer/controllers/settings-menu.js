import _ from 'lodash';

/**
 * 
 * @param {CTPlayerController} player 
 */
export const getSettingsMenu = (player) => {
  return [
    {
      text: 'Playback Rate',
      active: true,
      current: `${player.playbackRate }x`,
      menus: _.map([2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25], pr => ({
        value: pr,
        text: pr,
        onClick: player.setPlaybackRate,
        active: pr === player.playbackRate
      }))
    },
    {
      text: 'Closed Captions',
      current: player.language.text,
      menus: _.map(player.languages, lang => ({
        text: lang.text,
        value: lang.code,
        onClick: player.changeLanguage,
        active: lang.code === player.language.code
      }))
    }
  ]
}