import React from 'react';
import { Provider } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { ClassTranscribeHeader } from 'components';
import { util } from 'utils';

import { instpStore, connectWithRedux, setup, plControl, offControl, mediaControl } from './Utils';
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

  showSiderBar = (value) => {
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

  render() {
    const { sidebar, loading, ordering } = this.props;
    const paddingLeft = {
      paddingLeft: sidebar && window.innerWidth > 900 ? '19em' : '0',
    };

    return (
      <div className="ip-bg">
        <ClassTranscribeHeader
          subtitle="Instructor"
          showSiderBar={this.showSiderBar}
          display={sidebar}
        />

        <Sidebar showSiderBar={this.showSiderBar} />

        <main className="ip-container" style={paddingLeft}>
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
          {/* <Route path='/instructor/:offeringId' render={props => <Course />} /> */}

          <Confirmation />
          {Boolean(loading.type) && <Loader />}
          {Boolean(ordering.type) && <OrderingModal />}
        </main>
      </div>
    );
  }
}

export function Instructor(props) {
  const InstpConnectToRedux = withRouter(
    connectWithRedux(InstructorWithRedux, ['sidebar', 'loading', 'ordering', 'offerings'], ['all']),
  );

  return (
    <Provider store={instpStore}>
      <InstpConnectToRedux {...props} />
    </Provider>
  );
}
