import { getDefaultNSBItems } from '../CTNavSidebar';
/**
 * The props for CTNavHeaderTab component
 * @typedef {Object} CTNavHeaderTabProps
 * @property {String} text - The text content of the tab
 * @property {Boolean} active - True if it's the current tab
 * @property {String} href - The pathname of the tab
 */

/**
 * The props for CTNavHeader component
 * @typedef {Object} CTNavHeaderProps
 * @property {*} leftElem - Left side element
 * @property {*} subtitle - Subtitle element
 * @property {*} children - Default as right side element
 * @property {*} rightElem - Right side element
 * @property {CTNavHeaderTabProps[]} tabs - The Nav Header can have nav tabs
 * @property {*} tabTitleElem - The Nav Header can have a title element for tabs
 * @property {Boolean} showProfileMenu - The Nav Header supports profile menu
 * @property {Boolean} darkMode - The Nav Header supports the dark mode
 * @property {Boolean} fixed - The Nav Header `can display: fixed;`
 * @property {Boolean} bordered - The Nav Header can has a bottom border
 * @property {Boolean} shadowed - The Nav Header can has a bottom shadow
 */

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
 * The props for CTHeading component
 * @typedef {Object} CTHeadingProps
 * @property {String} heading - The Content of the heading
 * @property {String} icon - Icon name of the material-icons
 * @property {Boolean} sticky - The heading can be sticky
 * @property {Boolean} gradient - The background of the heading can be gradient
 * @property {Number} offsetTop - Set the offset top of the sticky heading
 */

/**
 * The props for CTLayout component
 * @typedef {Object} CTLayoutProps
 * @property {*} children - Page content
 * @property {String} className - Additional classes.
 * @property {String} role - Role of the `CTLayout`, default to be `role="main"`
 * @property {Boolean} defaultOpenSidebar - True if open the sidebar when the `CTLayout` rendered
 * @property {Boolean} darkMode - The `CTLayout` supports the dark mode
 * @property {Boolean} transition - True if smoothly show and hide sidebar
 * @property {Boolean} responsive - Sidebar can be responsive to the screen width
 * @property {Boolean} fill - True if fill the whole page
 * @property {Boolean} logoBrand - Determine display the logo brand or text-brand, default: `false`
 * @property {Boolean} footer = The page content can have a default footer
 * @property {CTNavHeaderProps} headerProps - Props to the nav header
 * @property {CTNavSidebarProps} sidebarProps - Props to the sidebar
 * @property {CTHeadingProps} headingProps - Props to the general heading
 * 
 */

/**
 * Create a props for CTLayout component
 * @callback CTLayoutPropsCreator
 * @param {CTNavHeaderPropsTypes} defaultSidebarItems
 * @returns {CTLayoutProps} The props for CTLayout component
 */

/**
 * Create the props for CTLayout component
 * @param {CTLayoutPropsCreator|CTLayoutProps} creator - the props creator
 * @returns {CTLayoutProps} The props for CTLayout component
 */
export function createCTLayoutProps(creator) {
  if (typeof creator === 'function') {
    let defaultSidebarItems = getDefaultNSBItems();
    return creator(defaultSidebarItems);
  }

  return creator;
}