import { 
  MENU_HIDE, 
  MENU_BEFORE_HIDE, 
  CO_CHANGE_VIDEO,
  SMTAB_GENERAL,
  // SMTAB_TRANS,
} from './constants.util'
import { searchControl } from './search.control'

export const menuControl = {
  currentMenu: null,
  menuTab: SMTAB_GENERAL,
  menu: function() {
    return this.currentMenu
  },
  
  setMenu: function() {},

  register: function({ setMenu }) {
    if (setMenu) this.setMenu = setMenu
  },

  clear: function(opt=CO_CHANGE_VIDEO) {
    if (opt === CO_CHANGE_VIDEO) {
      this.close()
    }
  },

  /**
   * 
   * @param {Sting} type - menu type
   * @param {String} option - 'a': stay, 'b': double open = close
   */
  open: function(type, option='a', tab) {
    searchControl.closeSearch()
    if (option === 'b' && this.currentMenu === type) {
      return this.close()
    } 

    this.setMenu(type)
    this.currentMenu = type
    // Set tab
    if (tab) this.tab(tab)
  },

  tab: function(tab_) {
    if (tab_ === undefined) return this.menuTab
    this.menuTab = tab_
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