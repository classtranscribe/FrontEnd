import React from 'react';
import {api} from 'utils';
import { BarsChart, Chart } from "./charts";
import {AnalyticTable} from './table'
import VideoViews from './VideoViews'
import { Tab } from 'semantic-ui-react'
import './index.css';
// import { Button } from 'semantic-ui-react';
export class Analytics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      offeringId: props.offeringId,
    }
  }
  
  render() {
    console.log('xxx', this.state)
    const { offeringId } = this.state
    return (
      <div className="outer">
        <MyTabs offeringId={offeringId}/>
      </div>
    );
  }
}


function MyTabs ({offeringId, playlists}){
  const panes = [

    { menuItem: 'Performance', render: () => <AnalyticTable offeringId={offeringId}/> },
    { menuItem: 'Charts', render: () => <VideoViews offeringId={offeringId} playlists={playlists} />},
    { menuItem: 'To be developed', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ]
  return (
     <Tab panes={panes} />
  );
}