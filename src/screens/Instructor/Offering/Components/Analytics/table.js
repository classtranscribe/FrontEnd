import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react'
import _ from 'lodash'


function parseCourseLogs(event, data) {
    const toReturn = []
    if (event === 'timeupdate') {
        data.forEach( elem => {
            var lastHr = 0, last3days = 0, lastWeek = 0, lastMonth = 0
            elem.medias.forEach( media => {
                lastHr += media.lastHr
                last3days += media.last3days
                lastMonth += media.lastMonth
                lastWeek += media.lastWeek
            })
            toReturn.push({ userName: elem.userId || 'unknown', lastHr: lastHr/4.0, last3days: last3days/4.0, lastMonth: lastMonth/4.0, lastWeek: lastWeek/4.0 })
        })
    }
    return toReturn
}

export function AnalyticTable ({data}){
    const [parsedData, setParsedData] = useState([])
    const [column, setColumn] = useState(null)
    const [direction, setDirection] = useState(null)

    useEffect(() => {
        if (data.length) {
            setParsedData(parseCourseLogs('timeupdate', data))
        }
    }, [data])

    const handleSort = (clickedColumn) => {
        if (column !== clickedColumn) {
            setColumn(clickedColumn)
            const sortedData = _.sortBy(parsedData, [clickedColumn])
            setParsedData(sortedData)
            setDirection('ascending')
        } else {
            setParsedData(parsedData.reverse())
            setColumn(clickedColumn)
            setDirection(direction === 'ascending' ? 'descending' : 'ascending')
        }

    }
    return (<div className = 'analytic_table'>
        <Table sortable celled fixed>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                    Name
                    </Table.HeaderCell>
                    <Table.HeaderCell 
                        sorted={column === 'lastHr' ? direction : null}
                        onClick={() => handleSort('lastHr')}
                    >
                    Last 1 hour(mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'last3days' ? direction : null}
                        onClick={() => handleSort('last3days')}
                    >
                    Last 3 day(mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'lastWeek' ? direction : null}
                        onClick={() => handleSort('lastWeek')}
                    >
                    Last 7 day(mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        sorted={column === 'lastMonth' ? direction : null}
                        onClick={() => handleSort('lastMonth')}
                    >
                    Last 30 day(mins)
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                    Total time spent
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                    Average time spent
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                    Percentile
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    parsedData.map( elem => 
                        <Table.Row key={elem.userName}>
                            <Table.Cell>{elem.userName}</Table.Cell>
                            <Table.Cell>{elem.lastHr}</Table.Cell>
                            <Table.Cell>{elem.last3days}</Table.Cell>
                            <Table.Cell>{elem.lastWeek}</Table.Cell>
                            <Table.Cell>{elem.lastMonth}</Table.Cell>
                            <Table.Cell>total time</Table.Cell>
                            <Table.Cell>avg total time</Table.Cell>
                            <Table.Cell>%</Table.Cell>
                        </Table.Row>
                    )
                }
            </Table.Body>
        </Table>
    </div>);
}
