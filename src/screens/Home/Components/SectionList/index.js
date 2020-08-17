import React from 'react';
import { CTFragment, CTText } from 'layout';
import { ARRAY_INIT } from 'utils/constants';
import SectionItem from './SectionItem';
import './index.scss';

const NoSectionHolder = () => (
  <CTFragment list vCenter padding={[40, 0]}>
    <CTText muted size="medium">No course found</CTText>
    <CTText padding="5" muted size="medium">
      Please reset the filter or refresh the page
    </CTText>
  </CTFragment>
);

function SectionList({
  sections
}) {
  const listProps = {
    list: true,
    role: 'list',
    padding: '10',
    alt: sections.length === 0,
    loading: sections === ARRAY_INIT,
    altElement: <NoSectionHolder />
  };

  return (
    <CTFragment {...listProps}>
      {sections.map((section, index) => (
        <SectionItem key={section.id + index} section={section} />
      ))}
    </CTFragment>
  );
}

export default SectionList;