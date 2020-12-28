import React, { Component } from 'react';
import { connect } from 'dva';
import { CTLayout, CTLoadable, altEl, makeEl } from 'layout';
import { ARRAY_INIT } from 'utils/constants';
import { Placeholder, SectionList, CourseFilter, MaintenanceMesg } from './components';

class HomeWithRedux extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // home.ctrl.setupHomepage(); no need
  }

  render() {
    const { sections, hasDepartmentSections } = this.props;
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true
    });
    const loading = sections === ARRAY_INIT;
    const loaderElement = makeEl(Placeholder);
    const sectionElement = altEl(SectionList, !loading, { sections, hasDepartmentSections });
    const filterElement = altEl(CourseFilter, !loading);
    console.log('render');
    return (
      <CTLayout {...layoutProps}>
        <MaintenanceMesg message="" />
        <CTLoadable loading={loading} loadingElement={loaderElement}>
          {filterElement}
          {sectionElement}
        </CTLoadable>
      </CTLayout>
    )
  }
}

export const Home = connect(({ home, loading }) => ({
  ...home
}))(HomeWithRedux);