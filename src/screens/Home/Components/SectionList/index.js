import React from 'react';
import { CTFragment } from 'layout';
import { ARRAY_INIT } from 'utils/constants';
import SectionItem from './SectionItem';
import './index.scss';

function SectionList({
  sections
}) {
  const loading = sections === ARRAY_INIT;
  const empty = sections.length === 0;

  return (
    <CTFragment list role="list" loading={loading} padding="10">
      {sections.map((section, index) => (
        <SectionItem key={section.id + index} section={section} />
      ))}
    </CTFragment>
  );
}

export default SectionList;