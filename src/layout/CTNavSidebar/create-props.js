/**
 * @typedef {Object} CTNavSidebarItemProps
 * @property {Boolean} darkMode - The sidebar item supports dark mode
 * @property {Boolean} breakline - The item can represent a `<hr />`
 * @property {String} value - A unique value for each sidebar item
 * @property {String} text - Text content of the sub-item
 * @property {*} children - Node content of the sub-item
 * @property {String} icon - True if show the sidebar
 * @property {String} href - Sub-item as a link
 * @property {Boolean} reloadOnPathnameChange - True if reload the page when access
 * @property {Function} onClick - Sub-item as a button
 * @property {Boolean} active - True if the tab is active
 * @property {String} activeType - Methods to deterine if the tab is active
 * @property {Boolean} mini - The sidebar supports a mini view
 * @property {CTNavSidebarItemProps[]} items - Sub-items of this tab
 */
 /**
 * Create the props for CTNavSidebarItem component
 * @param {CTNavSidebarItemProps} props - the props creator
 * @returns {CTNavSidebarItemProps} The props for CTNavSidebarItem component
 */
export function createCTNavSidebarItemProps(props) {
  return props;
}


 /**
 * The props for CTNavSidebar component
 * @typedef {Object} CTNavSidebarProps
 * @property {Boolean} show - True if show the sidebar
 * @property {CTNavSidebarItemProps[]} items - Nav list items on sidebar
 * @property {*} brandElem - The sidebar can have a brand element
 * @property {*} children - Primary content
 * @property {Boolean} darkMode - The Nav sidebar supports the dark mode
 * @property {Boolean} mini - The sidebar supports a mini view
 * @property {Boolean} float - True if display the floating sidebar
 * @property {Function} onClose - Handle close the sidebar
 */

 /**
 * Create the props for CTNavSidebar component
 * @param {CTNavSidebarProps} props - the props creator
 * @returns {CTNavSidebarProps} The props for CTNavSidebar component
 */
export function createCTNavSidebarProps(props) {
  return props;
}

createCTNavSidebarProps({
  
})