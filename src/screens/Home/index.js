import React from 'react';
import { connect } from 'dva';
import { env } from 'utils';
import { CTLayout, CTLoadable, altEl, makeEl } from 'layout';
import { ARRAY_INIT } from 'utils/constants';
import { Placeholder, SectionList, CourseFilter, MaintenanceMesg } from './components';

const HomeWithRedux = (props) => {
  const { sections, hasDepartmentSections } = props;
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
      <MaintenanceMesg message={maintenance} />
      <CTLoadable loading={loading} loadingElement={loaderElement}>
        {filterElement}
        {sectionElement}
      </CTLoadable>
    </CTLayout>
  );
}

export const Home = connect(({ home }) => ({
  ...home
}))(HomeWithRedux);