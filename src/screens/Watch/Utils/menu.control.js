import { MENU_HIDE, MENU_BEFORE_HIDE } from './constants.util'

export const menuControl = {
  setMenu: function() {},

  register: function({ setMenu }) {
    if (setMenu) this.setMenu = setMenu
  },

  open: function(type) {
    this.setMenu(type)
  },

  close: function() {
    this.setMenu(MENU_BEFORE_HIDE)
    setTimeout(() => {
      this.setMenu(MENU_HIDE)
    }, 200)
  },
}