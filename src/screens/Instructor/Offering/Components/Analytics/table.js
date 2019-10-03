import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'
import { Table, Button } from 'semantic-ui-react'
import {api} from 'utils';
import _ from 'lodash'
var fileDownload = require('js-file-download')



function parseCourseLogs(event, data, parsedData, caption) {
    const toReturn = []
    if (event === 'timeupdate') {
        data.forEach( (elem) => {
            var lastHr = 0, last3days = 0, lastWeek = 0, lastMonth = 0, totalTime = 0, count = 0
            elem.medias.forEach( media => {
                lastHr += media.lastHr
                last3days += media.last3days
                lastMonth += media.lastMonth
                lastWeek += media.lastWeek
                totalTime += media.count
            })
            if (parsedData && elem.user) {
                if (parsedData.filter( data => data.email === elem.user.email)[0]) {
                    lastHr = parsedData.filter( data => data.email === elem.user.email)[0].lastHr/4.0
                    last3days = parsedData.filter( data => data.email === elem.user.email)[0].last3days/4.0
                    lastMonth = parsedData.filter( data => data.email === elem.user.email)[0].lastMonth/4.0
                    lastWeek = parsedData.filter( data => data.email === elem.user.email)[0].lastWeek/4.0
                }
            }

            if (caption && elem.user) {
                if (caption.filter( data => data.email === elem.user.email)[0]) {
                    count = caption.filter( data => data.email === elem.user.email)[0].captionEdited
                }
            }

            toReturn.push({ 
                email: (elem.user ? elem.user.email : 'unknown'), 
                lastHr: lastHr, 
                last3days: last3days, 
                lastWeek: lastWeek, 
                lastMonth: lastMonth, 
                totalTime: totalTime/4.0, 
                captionEdited: count
            })
        })
    }

    if (event === 'edittrans') {
        data.forEach( (elem) => {
            var count = 0
            elem.medias.forEach( media => {
                count += media.count
            })
            toReturn.push({ 
                email: (elem.user ? elem.user.email : 'unknown'), 
                captionEdited: count
            })
        })
    }

    return toReturn
}

export function AnalyticTable ({offeringId}){
    const [parsedData, setParsedData] = useState([])
    const [total, setTotal] = useState([])
    const [column, setColumn] = useState(null)
    const [direction, setDirection] = useState(null)
    const [caption, setCaption] = useState([])

    useEffect(() => {
        api.getCourseLogs('timeupdate', offeringId)
        .then(({data}) => {
            setParsedData(parseCourseLogs('timeupdate', data))
        }) 
        api.getCourseLogs('edittrans', offeringId, "2010-04-03T11:11:11.111Z", new Date().toISOString())
        .then(({data}) => {
            setCaption(parseCourseLogs('edittrans', data))
        }) 
    }, [offeringId])

    useEffect(() => {
        api.getCourseLogs('timeupdate', offeringId, "2010-04-03T11:11:11.111Z", new Date().toISOString()).then(({data}) => {
            setTotal(parseCourseLogs('timeupdate', data, parsedData, caption))
        })
    }, [parsedData])
    
    
    const handleSort = (clickedColumn) => {
        if (column !== clickedColumn) {
            setColumn(clickedColumn)
            const sortedData = _.sortBy(total, [clickedColumn])
            setTotal(sortedData)
            setDirection('ascending')
        } else {
            setTotal(total.reverse())
            setColumn(clickedColumn)
            setDirection(direction === 'ascending' ? 'descending' : 'ascending')
        }

    }

    const onDownload = () => {
        const csvStr = Papa.unparse(total)
        fileDownload(csvStr, 'video-time.csv')
    }

    return (<div className = 'analytic_table'>
        <Button content="Download" onClick={onDownload} primary />
        <Table sortable celled fixed unstackable striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                    Rank
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'email' ? direction : null}
                        onClick={() => handleSort('email')}
                    >
                    Email
                    </Table.HeaderCell>
                    <Table.HeaderCell 
                        sorted={column === 'lastHr' ? direction : null}
                        onClick={() => handleSort('lastHr')}
                    >
                    Last 1 Hour (mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'last3days' ? direction : null}
                        onClick={() => handleSort('last3days')}
                    >
                    Last 3 Days (mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'lastWeek' ? direction : null}
                        onClick={() => handleSort('lastWeek')}
                    >
                    Last Week (mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'lastMonth' ? direction : null}
                        onClick={() => handleSort('lastMonth')}
                    >
                    Last Month (mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'totalTime' ? direction : null}
                        onClick={() => handleSort('totalTime')}
                    >
                    Total Time Spent (mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'captionEdited' ? direction : null}
                        onClick={() => handleSort('captionEdited')}
                    >
                    Captions Revised
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    total.map( (elem, index) =>  
                        <Table.Row key={elem.email}>
                            <Table.Cell>{index +1}</Table.Cell>
                            <Table.Cell>{elem.email}</Table.Cell>
                            <Table.Cell>{elem.lastHr}</Table.Cell>
                            <Table.Cell>{elem.last3days}</Table.Cell>
                            <Table.Cell>{elem.lastWeek}</Table.Cell>
                            <Table.Cell>{elem.lastMonth}</Table.Cell>
                            <Table.Cell>{elem.totalTime}</Table.Cell>
                            <Table.Cell>{elem.captionEdited}</Table.Cell>
                        </Table.Row>
                    )
                }
            </Table.Body>
        </Table>
    </div>);
}
