import { links } from 'utils/links';

export const getInstructorNavItems = () => {
  return [
    {
      value: 'ip-nsb-courses',
      text: 'Courses',
      href: links.instructor()
    },
    {
      value: 'ip-nsb-new course',
      text: 'New Course',
      href: links.instNewOffering()
    }
  ];
};