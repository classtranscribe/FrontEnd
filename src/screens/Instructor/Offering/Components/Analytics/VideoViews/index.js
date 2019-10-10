import React, { Component } from 'react';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalBarSeries, HorizontalBarSeries, LabelSeries} from 'react-vis';
import './index.css';
import 'react-vis/dist/style.css';
import { api } from 'utils'
import { parseCourseLogsForMediaViewChart, parseCourseLogs } from './util'
import { Tab, Table, Button } from 'semantic-ui-react'
import _ from 'lodash'
import Papa from 'papaparse'
var fileDownload = require('js-file-download')


export default class ForAllCharts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offeringId: props.offeringId,
            mediaViews:[],
            mediaViewsTotal:[]
        }
    }
    
    componentDidMount() {
        const { offeringId, playlists } = this.props
        api.getCourseLogs('timeupdate', offeringId, "2019-09-03T11:11:11.111Z", new Date().toISOString())
            .then(({data}) => {
                const mediaViews = parseCourseLogsForMediaViewChart(data, playlists).reverse()
                // console.log("---------media views", mediaViewsTotal)
                this.setState({ mediaViews })
            })
        api.getCourseLogs('timeupdate', offeringId)
            .then(({data}) => {
                const mediaViewsTotal = parseCourseLogs(data, playlists, 'count')
                console.log("---------media views", mediaViewsTotal)
                this.setState({ mediaViewsTotal })
            })
    }

    setMediaView = mediaViewsTotal => this.setState({ mediaViewsTotal })

    render() {
        const { mediaViews, mediaViewsTotal } = this.state
        const panes = [
            { menuItem: 'Chart', render: () => <VideoViewsChart mediaViews={mediaViews}/> },
            { menuItem: 'Table', render: () => <VideoViewsTable mediaViews={mediaViewsTotal} setMediaView={this.setMediaView}/> },
        ]
        return (
            <div className="downwards">
                <p>TOP 20 VIEWED VIDEOS</p>
                <hr></hr>
                <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
            </div>
        );
    }
}
    


function VideoViewsChart({ mediaViews }) {
    const labelData = mediaViews.map((d, idx) => ({
        x: d.x,
        y: d.y
        }));
    return (
        <div className="dora-chart">
            <div className="bar-chart">
                    <XYPlot height={600} width={600} yType="ordinal" margin={{left: 150, right: 60}} > 
                        <HorizontalGridLines />
                        <XAxis title="video minutes" />
                        <YAxis /> 
                        <HorizontalBarSeries data={mediaViews} />
                        {/* <LabelSeries data={labelData} getLabel={d => d.x}/> */}
                    </XYPlot>
            </div>
        </div>
    );
}



export class VideoViewsTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            column: null,
            direction: null,
        }
    }

    handleSort = (clickedColumn) => () => {
        const { column, direction } = this.state
        const { mediaViews, setMediaView } = this.props
        console.log(clickedColumn)
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                direction: 'ascending',
            })
            setMediaView(_.sortBy(mediaViews, [clickedColumn]).reverse())
        } else {
            this.setState({
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })
            setMediaView(mediaViews.reverse())
        }
    }  

    onDownload = () => {
        const { mediaViews } = this.props
        const csvStr = Papa.unparse(mediaViews)
        fileDownload(csvStr, 'video-length.csv')
    }

    render() {
        const { column, direction } = this.state
        const { mediaViews } = this.props
        return (<div className = 'VideoViewTable1'>
            <Button content="Download" onClick={this.onDownload} primary>
            </Button>
            <Table sortable celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell collapsing>
                            Index
                        </Table.HeaderCell>
        
                        <Table.HeaderCell
                            sorted={column === 'mediaName' ? direction : null}
                            onClick={this.handleSort('mediaName')}
                        >
                            MediaName
                        </Table.HeaderCell>

                        {/* <Table.HeaderCell
                            sorted={column === 'count' ? direction : null}
                            onClick={this.handleSort('count')}
                        >
                            Total Count
                        </Table.HeaderCell> */}
                        <Table.HeaderCell
                            sorted={column === 'lastHr' ? direction : null}
                            onClick={this.handleSort('lastHr')}
                        >
                            last 1 Hour(mins)
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'last3days' ? direction : null}
                            onClick={this.handleSort('last3days')}
                        >
                            last 3 days(mins)
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'lastWeek' ? direction : null}
                            onClick={this.handleSort('lastWeek')}
                        >
                            last week(mins)
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'lastMonth' ? direction : null}
                            onClick={this.handleSort('lastMonth')}
                        >
                            last month(mins)
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {
                    // _.map(mediaViews, ({ ,,}) => (
                    mediaViews.map(( media, index) => 
                        <Table.Row key={media.mediaName}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{media.mediaName}</Table.Cell>
                            {/* <Table.Cell>{media.count}</Table.Cell> */}
                            <Table.Cell>{media.lastHr}</Table.Cell>
                            <Table.Cell>{media.last3days}</Table.Cell>
                            <Table.Cell>{media.lastWeek}</Table.Cell>
                            <Table.Cell>{media.lastMonth}</Table.Cell>
                        </Table.Row>
                    )
                }
                </Table.Body>
            </Table>
        </div>);
    }
}









