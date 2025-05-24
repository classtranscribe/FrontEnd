import React from 'react';
import { env } from 'utils';
import { CTLayout, CTLoadable, altEl, makeEl } from 'layout';
import { ARRAY_INIT } from 'utils/constants';
import { useSelector } from 'react-redux';
import { Placeholder, SectionList, CourseFilter, MaintenanceMesg } from './components';

export const Home = () => {
  // const { sections, hasDepartmentSections } = props;
  const sections = useSelector((state) => state.home.sections);
  const hasDepartmentSections = useSelector((state) => state.home.hasDepartmentSections);
  const layoutProps = CTLayout.createProps({
    transition: true,
    responsive: true,
    footer: true
  });
  const loading = sections === ARRAY_INIT;
  const loaderElement = makeEl(Placeholder);
  const sectionElement = altEl(SectionList, !loading, { sections, hasDepartmentSections });
  const filterElement = altEl(CourseFilter, !loading);
  const maintenance = env.maintenanceWarningBanner;
  return (
    <CTLayout {...layoutProps}>
      <h1 className='sr-only'>Course Browser</h1>
      <MaintenanceMesg message={maintenance} />
      <CTLoadable loading={loading} loadingElement={loaderElement}>
        <h2 className='sr-only' role="search">Filter results</h2>{filterElement}
        <h2 className='sr-only'>Courses</h2>
        {sectionElement}
      </CTLoadable>
    </CTLayout>
  );
}