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
 * Create the props for CTNavHeader component
 * @param {CTNavHeaderProps} props - the props creator
 * @returns {CTNavHeaderProps} The props for CTNavHeader component
 */
export function createCTNavHeaderProps(props) {
  return props;
}