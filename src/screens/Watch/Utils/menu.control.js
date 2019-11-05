import { MENU_HIDE, MENU_BEFORE_HIDE } from './constants.util'

export const menuControl = {
  closeMenu: function(setMenu) {
    setMenu(MENU_BEFORE_HIDE)
    setTimeout(() => {
      setMenu(MENU_HIDE)
    }, 200)
  },
}