import { CTPreferenceV2 } from 'utils/user-preference';
import PConstants from './constants/PlayerConstants';

class PlayerPreference extends CTPreferenceV2 {
  // Player
  static LSAutoPlayKey = 'ct-autoplay';
  static LSPlaybackRateKey = 'ctp-playbackrate';
  static LSVolumeKey = 'ctp-volume';
  static LSMutedKey = 'ctp-muted';
  static LSScreenModeKey = 'ctp-screenmode';
  static LSOpenCCKey = 'ctp-cc-on';
  static LSLanguageKey = 'ctp-lang';
  static LSCCStyle = 'ctp-ccstyle';

  get autoPlay() {
    return this.isTrue(PlayerPreference.LSAutoPlayKey);
  }
  setAutoPlay(autoPlay) {
    this.setBool(PlayerPreference.LSAutoPlayKey, autoPlay);
  }

  get playbackRate() {
    return this.getNumVal(PlayerPreference.LSPlaybackRateKey, '1');
  }
  setPlaybackRate(playbackRate) {
    this.setVal(PlayerPreference.LSPlaybackRateKey, playbackRate);
  }

  get volume() {
    return this.getNumVal(PlayerPreference.LSVolumeKey, '1');
  }
  setVolume(volume) {
    this.setVal(PlayerPreference.LSVolumeKey, volume);
  }

  get muted() {
    return this.isTrue(PlayerPreference.LSMutedKey);
  }
  setMuted(muted) {
    this.setBool(PlayerPreference.LSMutedKey, muted);
  }

  get screenMode() {
    return this.getVal(PlayerPreference.LSScreenModeKey, PConstants.ScreenModeNormal);
  }
  setScreenMode(screenMode) {
    this.setVal(PlayerPreference.LSScreenModeKey, screenMode);
  }
  
  get openCC() {
    return this.isTrue(PlayerPreference.LSOpenCCKey);
  }
  setOpenCC(openCC) {
    this.setBool(PlayerPreference.LSOpenCCKey, openCC);
  }

  get language() {
    return this.getVal(PlayerPreference.LSLanguageKey);
  }
  setLanguage(langCode) {
    this.setVal(PlayerPreference.LSLanguageKey, langCode);
  }

  get ccStyle() {
    return this.getVal(PlayerPreference.LSCCStyle);
  }
  setCCStyle(ccStyle) {
    this.setVal(PlayerPreference.LSCCStyle, ccStyle);
  }
}

export default new PlayerPreference();