import { links } from 'utils/links';
import { createCTNavSidebarItemProps } from '../../CTNavSidebar/create-props';

export const getAdminNavItem = () => {
  return createCTNavSidebarItemProps({
    text: 'Admin',
    icon: 'supervisor_account',
    href: links.admin(),
    active: window.location.pathname.startsWith('/admin'),
    reloadOnPathnameChange: true,
    items: [
      {
        value: 'ap-nsb-universities',
        text: 'Universities',
        href: links.admin('universities')
      },
      {
        value: 'ap-nsb-terms',
        href: links.admin('terms'),
        text: 'Terms'
      },
      {
        value: 'ap-nsb-departments',
        text: 'Departments',
        href: links.admin('departments')
      },
      {
        value: 'ap-nsb-course-template',
        text: 'Course Template',
        href: links.admin('course-template')
      },
      {
        value: 'ap-nsb-instructors',
        text: 'Instructors',
        href: links.admin('instructors')
      },
      {
        value: 'ap-nsb-more',
        text: 'More',
        href: links.admin('more')
      },
      {
        value: 'ap-nsb-login-as-user',
        text: 'Login As User',
        href: links.admin('login-as-user'),
      }
    ]
  });
};