import React from 'react';
import {api} from 'utils';
import { BarsChart, Chart } from "./charts";
import {AnalyticTable} from './table'
import { Tab } from 'semantic-ui-react'
import './index.css';
// import { Button } from 'semantic-ui-react';
export class Analytics extends React.Component {
  constructor(props) {
    super(props)
    console.log('hi', props.offeringId)
    this.state = {
      data: [],
      offeringId: props.offeringId
    }
  }

  componentDidMount() {
    api.getCourseLogs('timeupdate', this.props.offeringId)
      .then(({data}) => {
        this.setState({data})
      })
  }
  
  render() {
    const { data } = this.state
    return (
      <div className="outer">
        <MyTabs data={data}/>
      </div>
    );
  }
}


function MyTabs ({data}){
  const panes = [
    { menuItem: 'Performance', render: () => <AnalyticTable data={data}/>},
    { menuItem: 'Charts', render: () => <div className = 'charts'>{/*<BarsChart data = {data}/> <Chart data = {data}/>*/}</div>},
    { menuItem: 'To be developed', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ]
  return (
     <Tab panes={panes} />
  );
}