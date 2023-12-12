import { prompt } from 'utils';

/**
 * Functions for controlling prompts
 */
const standardPosition = [70,70];

export const promptControl = {
  
  closePrompt() {
    prompt.closeAll();
  },

  editCaptionUsingKeyboard() {
    prompt.addOne({
      status: 'success',
      text: 'You are editing the current caption! Hit return to save changes.',
      offset: standardPosition,
    });
  },

  editCaptionTips() {
    prompt.addOne({
      text: 'Hit return to save your changes!',
      offset: standardPosition,
    });
  },

  savingCaption() {},

  savedCaption(isClosedCaption, success = true) {
    const captionType = isClosedCaption ? 'Closed Caption' : 'Description'
    prompt.addOne({
      status: success ? 'success' : 'error',
      text: success ? `${captionType} updated` : `${captionType} could not be saved`,
      offset: standardPosition,
      timeout: 3000,
    });
  },

  hideSecondaryScreen() {
    prompt.addOne({
      text: 'Click <i class="material-icons">video_label</i> to see more screen options.',
      offset: standardPosition,
      timeout: 5000,
    });
  },

  error(target = 'media data') {
    const { search, pathname } = window.location;
    prompt.addOne({
      text: `Couldn't load ${target}. Please&ensp;<a href="${
        pathname + search
      }">refresh</a>&ensp;to retry.`,
      offset: standardPosition,
      status: 'error',
    });
  },

  videoNotLoading() {
    prompt.addOne({
      text: `Sorry, if the video can't load, please use Chrome to open the page. 
        <a href=${`googlechrome-x-callback://x-callback-url/open/?url=${encodeURIComponent(
          window.location.href,
        )}&x-source=Safari&x-success=${encodeURIComponent(
          window.location.href,
        )}`}>Click to open in Chrome</a>`,
      position: 'top',
      status: 'error',
    });
  },
};
