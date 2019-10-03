import React, { Component } from 'react';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalBarSeries, HorizontalBarSeries, LabelSeries} from 'react-vis';
import './index.css';
import 'react-vis/dist/style.css';
import { api } from 'utils'
import { parseCourseLogsForMediaView } from './util'

  


export default class VideoViews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playlists: props.playlists,
            mediaViews: []
        }
    }

    componentDidMount() {
        const { offeringId, playlists } = this.props
        api.getCourseLogs('timeupdate', offeringId, "2019-09-03T11:11:11.111Z", new Date().toISOString())
            .then(({data}) => {
                console.log("course-log-------------", data)
                console.log("playlists =--------------", playlists)
                const mediaViews = parseCourseLogsForMediaView(data, playlists)
                console.log("---------media views", mediaViews)
                this.setState({ mediaViews })
            })
    }


    render() { 
        const { mediaViews } = this.state
        const labelData = mediaViews.map((d, idx) => ({
            x: d.x + 300,
            y: d.y
          }));
        return (
        <div className="dora-chart">
            <div className="circle-chart">
                    <p>TOP SEARCH KEY WORDS</p>
                    <hr></hr>
                    <XYPlot height={400} width={400}>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis />
                        <YAxis />   
                        <LineSeries data={mediaViews} />
                    </XYPlot>
            </div>

            <div className="bar-chart">
                    <p>MOST VIEWED VIDEOS</p>
                    <hr></hr>
                    <XYPlot height={600} width={600} yType="ordinal" margin={{left: 150}} > 
                        <HorizontalGridLines />
                        <XAxis title="views" />
                        <YAxis /> 
                        <HorizontalBarSeries data={mediaViews.reverse()} />
                        <LabelSeries data={labelData} getLabel={d => d.x} />
                    </XYPlot>
                </div>

                {/* <div className="d-chart">
                    <XYPlot width={300} height={300}>
                    <LabelSeries
                        animation
                        allowOffsetToBeReversed
                        data={mediaViews} />
                    </XYPlot>
                </div> */}
        </div>
        );
    }
}