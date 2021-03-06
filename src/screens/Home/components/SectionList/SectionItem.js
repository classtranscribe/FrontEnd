import React from 'react';
import { Link } from 'dva/router';
import { CourseCard, MediaCard } from 'components';
import {
  CTFragment,
  CTHeading,
  CTText,
  CTHorizontalScroll,
  makeEl,
  altEl
} from 'layout';
import HomeConstants from '../../controllers/HomeConstants';

function sectionItemsElements(section) {
  const { type, items } = section;
  switch (type) {
    case HomeConstants.FSectionCourses:
      return items.map((item) => <CourseCard key={item.id} {...CourseCard.parse(item)} />);
    case HomeConstants.FSectionVideos:
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
    <CTFragment role="listitem" className="ct-homep section-con">
      <CTFragment className="ct-homep section-title-con">
        {titleElement}
        {subTitleElement}
      </CTFragment>
      <CTFragment padding={[0,0,0,5]}>
        <CTHorizontalScroll>
          {sectionItemsElements(section)}
        </CTHorizontalScroll>
      </CTFragment>
    </CTFragment>
  );
}

export default SectionItem;
