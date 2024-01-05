import { links } from 'utils';
import { createCTNavSidebarItemProps } from '../../CTNavSidebar/create-props';

const externalLinks = [
  {
    value: 'ct-nsb-extLinks-traefik',
    text: 'traefik',
    href: links.traefik(),
    icon: 'link'
  },
  {
    value: 'ct-nsb-extLinks-pgadmin',
    text: 'pgadmin',
    href: links.pgadmin(),
    icon: 'link'
  },
  {
    value: 'ct-nsb-extLinks-swag',
    text: 'swag',
    href: links.swag(),
    icon: 'link'
  },
  {
    value: 'ct-nsb-extLinks-rabbitmq',
    text: 'rabbitmq',
    href: links.rabbitmq(),
    icon: 'link'
  }
]

let items = [
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
 /* {
    value: 'ap-nsb-event-logs',
    text: 'Event Logs',
    href: links.admin('event-logs')
  }, */
  {
    value: 'ap-nsb-login-as-user',
    text: 'Login As User',
    href: links.admin('login-as-user'),
  },
];

items = items.concat(externalLinks);

export const getAdminNavItem = () => {
  return createCTNavSidebarItemProps({
    text: 'Admin',
    icon: 'supervisor_account',
    href: links.admin(),
    active: window.location.pathname.startsWith('/admin'),
    reloadOnPathnameChange: false,
    value: '',
    items
  });
};