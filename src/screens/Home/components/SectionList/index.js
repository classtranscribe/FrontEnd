import React from 'react';
import { CTFragment, CTText, makeEl } from 'layout';
import { ARRAY_INIT } from 'utils/constants';
import SectionItem from './SectionItem';
import './index.scss';

const NoSectionHolder = () => (
  <CTFragment dFlexCol fadeIn alignItCenter padding={[40, 0]}>
    <CTText muted size="medium">No course found</CTText>
    <CTText padding="5" muted size="medium">
      Please reset the filter or refresh the page
    </CTText>
  </CTFragment>
);

const addReactKey = (sections) => sections.map((section, index) => {section.reactKey=`Section-${section.id}-${index}`;return section;});

function SectionList({
  sections,
  hasDepartmentSections
}) {
  const hasSections = sections.length > 0;
  const sectionsWithKey = hasSections? addReactKey(sections) : [];
  const slHasDepartmentSections = hasSections && hasDepartmentSections;

  const noSectionHolderEl = makeEl(NoSectionHolder);

  const listProps = {
    dFlexCol: true,
    alt: !hasSections,
    loading: sections === ARRAY_INIT,
    altElement: noSectionHolderEl
  };

  return (
    <CTFragment {...listProps}>
      {!slHasDepartmentSections && noSectionHolderEl}

      <CTFragment role="list" dFlexCol padding="10">
        {sectionsWithKey.map((section) => (
          <SectionItem key={section.reactKey} section={section} />
        ))}
      </CTFragment>
    </CTFragment>
  );
}

export default SectionList;