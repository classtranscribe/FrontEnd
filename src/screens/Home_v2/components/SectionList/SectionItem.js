import React from 'react';
import { CTFragment, CTHeading, CTText, makeEl, altEl } from 'layout';
import { home } from '../../controllers';

function SectionItemsSelector(section) {
  const { type } = section;
  switch (type) {
    case home.const.FSectionCourses:
      return type;
    case home.const.FSectionVideos:
      return type;
    default:
      return null;
  }
}

function SectionItem({ section }) {
  const { title, subTitle, icon } = section;

  const titleElement = makeEl(CTHeading, {
    as: 'h3',
    icon,
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
      <CTFragment vEnd className="ct-homep section-title-con">
        {titleElement}
        {subTitleElement}
      </CTFragment>
      <CTFragment>
        {SectionItemsSelector(section)}
      </CTFragment>
    </CTFragment>
  );
}

export default SectionItem;
