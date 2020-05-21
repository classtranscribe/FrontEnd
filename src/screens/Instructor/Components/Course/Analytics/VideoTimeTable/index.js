import React, { useState, useEffect } from 'react';
import { Table, Dimmer, Loader, Segment } from 'semantic-ui-react';
import { Button } from 'pico-ui';
import _ from 'lodash';
import './index.css';
import { vtime } from './vtime';

export default function VideoTimeTable({ offeringId }) {
  const [total, setTotal] = useState([]);
  const [column, setColumn] = useState(null);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    vtime.init({ offeringId, setTotal });
    vtime.setup();
  }, [offeringId]);

  const handleSort = (clickedColumn) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      const sortedData = _.sortBy(total, [clickedColumn]);
      setTotal(sortedData);
      setDirection('ascending');
    } else {
      setTotal(total.reverse());
      setColumn(clickedColumn);
      setDirection(direction === 'ascending' ? 'descending' : 'ascending');
    }
  };

  const onDownload = () => vtime.download();

  return (
    <div className="analytic_table">
      <div className="ct-d-r-end">
        <Button
          uppercase
          text="Download"
          color="teal"
          onClick={onDownload}
          loading={total.length === 0}
        />
      </div>

      {total.length === 0 ? (
        <div>
          <Segment className="table_loader">
            <Dimmer active inverted>
              <Loader inverted content="Loading" />
            </Dimmer>
          </Segment>
        </div>
      ) : (
        <Table sortable celled fixed unstackable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Rank</Table.HeaderCell>
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
                sorted={column === 'count' ? direction : null}
                onClick={() => handleSort('count')}
              >
                Total Video Time (mins)
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'editTransCount' ? direction : null}
                onClick={() => handleSort('editTransCount')}
              >
                Captions Revised
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {total.map((elem, index) => (
              <Table.Row key={elem.email}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{elem.email}</Table.Cell>
                <Table.Cell>{Math.round(elem.lastHr)}</Table.Cell>
                <Table.Cell>{Math.round(elem.last3days)}</Table.Cell>
                <Table.Cell>{Math.round(elem.lastWeek)}</Table.Cell>
                <Table.Cell>{Math.round(elem.lastMonth)}</Table.Cell>
                <Table.Cell>{Math.round(elem.count)}</Table.Cell>
                <Table.Cell>{elem.editTransCount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
