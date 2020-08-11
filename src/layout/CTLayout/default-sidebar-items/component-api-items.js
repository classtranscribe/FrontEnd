import { links } from 'utils/links';
import { createCTNavSidebarItemProps } from '../../CTNavSidebar/create-props';

export const getComponentAPINavItem = () => {
  return createCTNavSidebarItemProps({
    text: 'Components (Dev)',
    icon: 'description',
    href: links.componentAPI('ct-form'),
    active: window.location.pathname.startsWith(links.componentAPI('')),
    reloadOnPathnameChange: true,
    items: [
      {
        value: 'capi-ct-form',
        text: 'CTForm',
        href: links.componentAPI('ct-form')
      }
    ]
  });
};