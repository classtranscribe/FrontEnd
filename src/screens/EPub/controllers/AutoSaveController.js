import { api, prompt } from 'utils';
import Constants from './constants/EPubConstants';
import { epubState } from './EPubStateManager';

class AutoSaveController {
  constructor() {
    this.__timer = null;
  }

  /**
   * Call before the save function to notify user 
   * when this saving is done
   */
  notifyOnce() {
    this.__notifyOnce = true;
  }

  async updateEPub(data) {
    epubState.setSaved(Constants.EpbSaving);
    try {
      await api.updateEPub(data);
      epubState.setSaved(Constants.EpbSaved);
      if (this.__notifyOnce) {
        this.__notifyOnce = false;
        prompt.addOne({ status: 'success', text: 'Saved!', timeout: 4000 });
      }
    } catch (error) {
      prompt.error('Failed to update ePub');
      epubState.setSaved(Constants.EpbSaveFailed);
    }
  }

  save(data, timeout = 3000) {
    epubState.setSaved(Constants.EpbUnsaved);
    if (this.__timer) {
      clearTimeout(this.__timer);
    }

    this.__timer = setTimeout(() => {
      this.updateEPub(data);
    }, timeout);
  }
}

export const saveCtrl = new AutoSaveController();
export default AutoSaveController;