import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTLoadable, altEl } from 'layout';
import { ARRAY_INIT } from 'utils/constants';
import { homeStore, connectWithRedux, home } from './controllers';
import { SectionList, CourseFilter } from './components';

class HomeWithRedux extends Component {
  constructor(props) {
    super(props);

    home.state.init(props);
  }

  componentDidMount() {
    home.ctrl.setupHomepage();
  }

  render() {
    const { sections } = this.props;
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
    });

    const loading = sections === ARRAY_INIT;
    const sectionElement = altEl(SectionList, !loading);
    const filterElement = altEl(CourseFilter, !loading);

    return (
      <CTLayout {...layoutProps}>
        <CTLoadable loading={loading}>
          {filterElement}
          {sectionElement}
        </CTLoadable>
      </CTLayout>
    )
  }
}

export const Home = withReduxProvider(
  HomeWithRedux,
  homeStore,
  connectWithRedux,
  ['sections'],
  ['all']
);
