import React from 'react';
import { Route } from 'react-router-dom';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'components';
import { util } from 'utils';

import { 
  instpStore, 
  connectWithRedux, 
  setup, 
  plControl, 
  offControl, 
  mediaControl
} from './Utils';
import './index.css';

import {
  Loader,
  Course,
  NewCourse,
  Sidebar,
  Playlist,
  Confirmation,
  OrderingModal,
} from './Components';

export class InstructorWithRedux extends React.Component {
  constructor(props) {
    super(props);
    util.links.title('My Courses');
    setup.init(props);
    plControl.init(props);
    offControl.init(props);
    mediaControl.init(props);
  }

  handleShowSidebar = (value) => {
    const { setSidebar, sidebar } = this.props;
    if (typeof value === 'boolean') {
      setSidebar(value);
    } else {
      setSidebar(!sidebar);
    }
  };

  componentDidMount() {
    setup.setupOfferings();
  }

  getLayoutProps() {
    return CTLayout.createProps({
      fill: true,
      transition: true,
      headerProps: {
        subtitle: 'Instructor',
      },
      sidebarProps: {
        float: true,
      }
    });
  }

  render() {
    const { loading, ordering } = this.props;

    return (
      <CTLayout {...this.getLayoutProps()}>
        <div className="ip-bg">
          <Sidebar handleShowSidebar={this.handleShowSidebar} />

          <div className="ip-container">
            <Route path="/instructor/new-offering" component={NewCourse} />
            <Route
              path="/instructor/:offId"
              render={() => (
                <>
                  <Course />
                  <Playlist />
                </>
              )}
            />

            <Confirmation />
            {Boolean(loading.type) && <Loader />}
            {Boolean(ordering.type) && <OrderingModal />}
          </div>
        </div>
      </CTLayout>
    );
  }
}

export const Instructor = withReduxProvider(
  InstructorWithRedux,
  instpStore,
  connectWithRedux,
  ['sidebar', 'loading', 'ordering', 'offerings'],
  ['all']
);