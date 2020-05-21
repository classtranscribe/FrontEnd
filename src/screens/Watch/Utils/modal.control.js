import { MODAL_HIDE, MODAL_BEFORE_HIDE } from './constants.util';
import { searchControl } from './search.control';

export const modalControl = {
  currentModal: MODAL_HIDE,
  modal() {
    return this.currentModal;
  },

  setModal() {},

  register({ setModal }) {
    if (setModal) this.setModal = setModal;
  },

  /**
   *
   * @param {Sting} type - modal type
   */
  open(type, option = 'a', tab) {
    searchControl.closeSearch();
    if (option === 'b' && this.currentModal === type) {
      return this.close();
    }

    this.setModal(type);
    this.currentModal = type;
  },

  isOpen() {
    return this.currentModal !== MODAL_HIDE;
  },

  close(timeout = 100) {
    if (this.currentModal === MODAL_HIDE) return;
    this.currentModal = MODAL_HIDE;
    this.setModal(MODAL_BEFORE_HIDE);
    setTimeout(() => {
      this.setModal(MODAL_HIDE);
    }, timeout);
  },
};
