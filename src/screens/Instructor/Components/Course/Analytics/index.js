import React from 'react';
import { Tab } from 'semantic-ui-react';

import VideoTimeTable from './VideoTimeTable';

import { connectWithRedux, setup } from '../../../Utils';
import './index.css';

const panes = [
  { menuItem: 'Video Time', render: () => <VideoTimeTable offeringId={setup.offering().id} /> },
  // { menuItem: 'Charts', render: () => <ForAllCharts offeringId={offeringId} playlists={playlists} />},
  // { menuItem: 'To be developed', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
];

function Analytics({ isViewingAnalytics, setIsViewingAnalytics }) {
  const onClose = () => setIsViewingAnalytics(false);

  return (
    <div className="ip-ana-con ct-a-fade-in">
      <div className="w-auto">
        <button className="plain-btn ip-goback" onClick={onClose}>
          <span tabIndex="-1">
            <i className="material-icons" aria-hidden="true">
              chevron_left
            </i>{' '}
            GO BACK
          </span>
        </button>
      </div>

      <h2 className="ip-title">Course Analytics</h2>

      <div className="ip-ana-tab-con">
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </div>
    </div>
  );
}

export default connectWithRedux(Analytics, [], ['setIsViewingAnalytics']);
