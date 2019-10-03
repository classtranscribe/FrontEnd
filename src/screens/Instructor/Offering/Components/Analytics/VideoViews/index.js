import React, { Component } from 'react';
import './index.css';
import 'react-vis/dist/style.css';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, HorizontalBarSeries, LabelSeries} from 'react-vis';


export default class VideoViews extends Component {
  render() {
    const data = [
      {x: 0, y: 8},
      {x: 1, y: 5},
      {x: 2, y: 4},
      {x: 3, y: 9},
      {x: 4, y: 1},
      {x: 5, y: 7},
      {x: 6, y: 6},
      {x: 7, y: 3},
      {x: 8, y: 2},
      {x: 9, y: 0}
    ];
    return (
      <div className="dora-chart">


          <div className="circle-chart">
                <p>TOP SEARCH KEY WORDS</p>
                <hr></hr>
                <XYPlot height={300} width={400}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />   
                <LineSeries data={data} />
                </XYPlot>
           </div>



           <div className="bar-chart">
                <p>MOST VIEWED VIDEOS</p>
                <hr></hr>
                <XYPlot height={300} width={400}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />               
                <HorizontalBarSeries data={data} />
                </XYPlot>
                <p></p>
            </div>

            <div className="d-chart">
                <XYPlot width={300} height={300}>
                <LabelSeries
                    animation
                    allowOffsetToBeReversed
                    data={data} />
                </XYPlot>
            </div>
      </div>
    );
  }
}