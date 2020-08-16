import React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard, MediaCard } from 'components';
import {
  CTFragment,
  CTHeading,
  CTText,
  CTHorizontalScroll,
  makeEl,
  altEl
} from 'layout';
import { home } from '../../controllers';

function sectionItemsElements(section) {
  const { type, items } = section;
  switch (type) {
    case home.const.FSectionCourses:
      return items.map((item) => <CourseCard key={item.id} {...CourseCard.parse(item)} />);
    case home.const.FSectionVideos:
      return items.map((item) => <MediaCard key={item.id} {...MediaCard.parse(item)} />);
    default:
      return null;
  }
}

function SectionItem({ section }) {
  const { title, subTitle, icon, link } = section;

  const titleElement = makeEl(CTHeading, {
    as: link ? Link : 'h3',
    icon,
    to: link,
    highlightIcon: true,
    className: 'ct-homep section-title',
    children: title
  });

  const subTitleElement = altEl(CTText, Boolean(subTitle), {
    celadon: true,
    className: 'ct-homep section-sub-title',
    children: subTitle,
    size: 'medium'
  });

  return (
    <CTFragment className="ct-homep section-con">
      <CTFragment className="ct-homep section-title-con">
        {titleElement}
        {subTitleElement}
      </CTFragment>
      <CTFragment>
        <CTHorizontalScroll>
          {sectionItemsElements(section)}
        </CTHorizontalScroll>
      </CTFragment>
    </CTFragment>
  );
}

export default SectionItem;