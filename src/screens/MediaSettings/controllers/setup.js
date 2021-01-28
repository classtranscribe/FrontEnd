import { api, links, user } from 'utils';

class SetupMSP {
  constructor() {
    this.redux = {};
    this.media_ = api.parseMedia();
    this.playlist_ = {};
    this.error_ = null;
  }
  getTab(pathname) {
    pathname = pathname || window.location.pathname;
    const strs = pathname.split('/');
    return strs[strs.length - 1];
  }
  
  enterFullscreen(id) {
    try {
      const elem = document.getElementById(id) || {};
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.webkitEnterFullscreen) {
        /* Safari IOS Mobile */
        elem.webkitEnterFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen.');
    }
  }

  exitFullscreen() {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen.');
    }
  }
}

export const setup = new SetupMSP();
