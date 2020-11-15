import { links } from 'utils/links';

/**
 * Parse raw offering object to valid CourseCard props
 * @param {Object} offering 
 */
export function parseCourse(offering) {
  let { 
    id,
    fullNumber,
    courseName,
    termName,
    term,
    sectionName,
    description,
  } = offering;

  return {
    id,
    number: fullNumber,
    name: courseName,
    term: termName || (term ? term.name : 'Unknown Term'),
    section: sectionName,
    description,
    href: links.course(id)
  };
}