import { DefaultSidebarItems } from './default-sidebar-items';

/**
 * The props for CTLayout component
 * @typedef {Object} CTMetaTagsProps
 * @property {String} title - <title>{title}</title>
 * @property {String} description - <meta name="description" content={description} />
 * @property {String} keywords - <meta name="keywords" content={keywords} />
 * 
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
 * @property {import("../CTNavHeader/create-props.js").CTNavHeaderProps} headerProps - Props to the nav header
 * @property {import("../CTNavSidebar/create-props.js").CTNavSidebarProps} sidebarProps - Props to the sidebar
 * @property {import("../CTHeading/create-props.js").CTHeadingProps} headingProps - Props to the general heading
 * @property {CTMetaTagsProps} metaTagsProps - Props to the CTMetaTags
 */

/**
 * Create a props for CTLayout component
 * @callback CTLayoutPropsCreator
 * @param {DefaultSidebarItems} sidebarItems
 * @returns {CTLayoutProps} The props for CTLayout component
 */

/**
 * Create the props for CTLayout component
 * @param {CTLayoutPropsCreator|CTLayoutProps} creator - the props creator
 * @returns {CTLayoutProps} The props for CTLayout component
 */
export function createCTLayoutProps(creator) {
  const sidebarItems = new DefaultSidebarItems();
  let props = {};

  if (typeof creator === 'function') {
    props = creator(sidebarItems);
  } else {
    props = creator;
  }

  if (!props.sidebarProps) {
    props.sidebarProps = {};
  }

  if (!props.sidebarProps.items) {
    props.sidebarProps.items = sidebarItems.defaultItems;
  }

  return props;
}