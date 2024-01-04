import { links } from 'utils/links';

import TermPane from './Terms';
import UniPane from './Universities';
import DepartPane from './Departments';
import CoursePane from './Courses';
import InstructorPane from './Instructors';
import EventLogs from './EventLogs';
import LoginAsUser from './LoginAsUser';

export const tabs = [
  {
    value: 'ap-tab-universities',
    text: 'Universities',
    href: links.admin('universities'),
    component: UniPane 
  },
  {
    value: 'ap-tab-terms',
    href: links.admin('terms'),
    text: 'Terms',
    component: TermPane
  },
  {
    value: 'ap-tab-departments',
    text: 'Departments',
    href: links.admin('departments'),
    component: DepartPane
  },
  {
    value: 'ap-tab-course-template',
    text: 'Course Template',
    href: links.admin('course-template'),
    component: CoursePane
  },
  {
    value: 'ap-tab-instructors',
    text: 'Instructors',
    href: links.admin('instructors'),
    component: InstructorPane
  },
  {
    value: 'ap-tab-event-logs',
    text: 'Event Logs',
    href: links.admin('event-logs'),
    component: EventLogs
  },
  {
    value: 'ap-tab-login-as-user',
    text: 'Login As User',
    href: links.admin('login-as-user'),
    component: LoginAsUser
  }
];