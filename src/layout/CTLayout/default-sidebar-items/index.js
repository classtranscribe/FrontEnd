import { user, links } from 'utils';
import { createCTNavSidebarItemProps } from '../../CTNavSidebar/create-props';
import { getAdminNavItem } from './admin-items';


export class DefaultSidebarItems {
  constructor() {
    this.create = createCTNavSidebarItemProps;
  }

  get home() {
    return this.create({
      value: 'ct-nsb-home',
      text: 'Home',
      icon: 'home',
      href: links.home(),
      activeType: 'exact',
      items: []
    });
  }

  get search() {
    return this.create({
      value: 'ct-nsb-search',
      text: 'Search',
      icon: 'search',
      href: links.search(),
      activeType: 'starts',
      items: []
    });
  }

  get history() {
    return this.create({
      value: 'ct-nsb-history',
      text: 'History',
      icon: 'history',
      href: links.history(),
      activeType: 'starts',
      items: []
    });
  }

  get analytics() {
    return this.create({
      value: 'ct-nsb-analytics',
      text: 'Analytics',
      icon: 'bar_chart',
      href: links.personalAnalytics(),
      activeType: 'starts',
      items: []
    });
  }

  get admin() {
    return getAdminNavItem();
  }

  get myCourses() {
    return this.create({
      text: 'My Courses',
      icon: 'class',
      href: links.instructor(),
      activeType: 'starts',
      items: [],
      reloadOnPathnameChange: true
    });
  }

  get breakline() {
    return 'breakline';
  }

  get defaultItems() {
    let items = [this.home, this.search];

    if (user.isLoggedIn) {
      items.push(this.history);
      items.push(this.analytics);
    }

    const isInstructor = user.isInstructor;
    const isAdmin = user.isAdmin;

    if (isInstructor || isAdmin) {
      items.push('breakline');
    }

    if (isInstructor) {
      items.push(this.myCourses);
    }

    if (isAdmin) {
      items.push(this.admin);
    }

    return items;
  }
}

