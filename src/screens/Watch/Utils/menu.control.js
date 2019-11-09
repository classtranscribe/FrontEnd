import { MENU_HIDE, MENU_BEFORE_HIDE } from './constants.util'

export const menuControl = {
  currentMenu: null,
  menu: function() {
    return this.currentMenu
  },
  
  setMenu: function() {},

  register: function({ setMenu }) {
    if (setMenu) this.setMenu = setMenu
  },

  /**
   * 
   * @param {Sting} type - menu type
   * @param {String} option - 'a': stay, 'b': double open = close
   */
  open: function(type, option='a') {
    if (option === 'b' && this.currentMenu === type) {
      this.close()
      return;
    } 
    this.setMenu(type)
    this.currentMenu = type
  },

  isOpen: function() {
    return Boolean(this.currentMenu)
  },

  close: function(timeout=200) {
    if (this.currentMenu === null) return;
    this.currentMenu = null
    this.setMenu(MENU_BEFORE_HIDE)
    setTimeout(() => {
      this.setMenu(MENU_HIDE)
    }, timeout)
  },
}