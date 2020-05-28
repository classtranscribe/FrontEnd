import { links } from 'utils/links';
import { user } from 'utils/user';

import { getAdminNavItems } from './admin-items';
import { getInstructorNavItems } from './instructor-items';

const createNSBItem = (text, icon, href, activeType = 'starts', items=[]) => ({
  text,
  icon,
  href,
  items,
  activeType,
  value: `ct-nsb-${ text.toLowerCase().replace(' ', '-')}`
});

export const getDefaultNSBItems = () => {
  let nsbitems = [
    // homepage
    createNSBItem('Home', 'home', links.home(), 'exact'),
    createNSBItem('Search', 'search', links.search()),
    createNSBItem('History', 'history', links.history()),
    createNSBItem('Analytics', 'bar_chart', links.personalAnalytics()),
  ];

  const isInstructor = user.isInstructor;
  const isAdmin = user.isAdmin;

  if (isInstructor || isAdmin) {
    nsbitems.push('breakline');
  }

  if (isInstructor) {
    nsbitems.push(createNSBItem(
      'My Courses',
      'class',
      links.instructor(),
      'starts',
      getInstructorNavItems()
    ));
  }

  if (isAdmin) {
    nsbitems.push(createNSBItem(
      'Admin', 
      'supervisor_account', 
      links.admin(), 
      'starts',
      getAdminNavItems()
    ));
  }

  return nsbitems;
}