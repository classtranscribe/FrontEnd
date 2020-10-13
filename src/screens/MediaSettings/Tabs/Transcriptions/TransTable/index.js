import React, { useState, useEffect, memo, useMemo } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api } from 'utils';
import { CTFragment } from 'layout';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { VariableSizeList as List , areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { connectWithRedux } from '../../../controllers/trans';
import TransTime from "../TransTime"
import TransText from "../TransText"


function TransTable({
  media = undefined,
  transcriptions,
  language,
  setVideoTime,
  setTranscriptions }) {
  const [captions, setCaptions] = useState([])
  const [time, setTime] = useState(30)
  const handleVideoTimeChange =
    () => {
      setVideoTime(time)
      setTime(time + 0.01)
    }
  const createRow = (id, operations, begin, end, text) => {
    return { id, operations, begin, end, text };
  }
  const createData = () => {
    let data = [];
    for (let i = 0; i < captions.length; i += 1) {
      data.push(
        createRow(
          captions[i].index,
          <div />,
          captions[i].begin,
          captions[i].end,
          captions[i].text
        )
      )
    }
    return data;
  }
  const data = createData();

  // fetching the transcriptions from API
  useEffect(() => {
    if (!media.isUnavailable) {
      // set transcriptions
      setTranscriptions(media.transcriptions);
      media.transcriptions.forEach(
        (val) => {
          if (val.language === language) {
            api.getCaptionsByTranscriptionId(val.id).then((res) => {
              if (res && res.status === 200)
                // set captions array
                setCaptions(res.data);
            })
          }
        }
      )
    }
  }, [media])

  useEffect(() => {
    createData()
    // console.log(transcriptions)
    // console.log(captions)
  }, [captions])
  // 
  const tableRow = memo(({ index, style, data: { columns, items } }) => {
    const item = items[index];
    return (
      <TableRow component="div" style={style} className={`msp-table-row row${index}`}>
        {columns.map((column, colIndex) => {
          return (
            <TableCell
              className={`msp-table-cell cell${index}`}
              key={item.id + colIndex}
              component="div"
              variant="body"
              style={{
                borderBottom: 0
              }}
            >
              {colIndex === 2 ?
                <TransText text={item[column.dataKey]} index={index} /> :
                <TransTime time={item[column.dataKey]} index={index} />}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }, areEqual)

  const itemKey = (index, data_) => data_.items[index].id;
  const createItemData = (columns, data_) => ({
    columns,
    items: data_
  });
  // id, operations, begin, end, text 
  const columns = [
    {
      label: "begin",
      dataKey: "begin",
      width: 120
    },
    {
      label: "end",
      dataKey: "end",
      width: 120
    },
    {
      label: "text",
      dataKey: "text",
      width: 320
    },
  ];

  const itemData = createItemData(columns, data);

  return (
    <CTFragment id="msp-t-table-con" data-scroll>
      <Table id="msp-trans-table">
        <TableHead component="div">
          <Button className="header-button" startIcon={<SaveIcon />}>Save</Button>
          <Button className="header-button" startIcon={<CancelIcon />}>Cancel</Button>
        </TableHead>
        <TableBody component="div">
          <AutoSizer>
            {({ height, width }) => (
              <List
                overscanCount={30}
                height={height}
                width={width}
                itemCount={data.length}
                itemSize={() => { return 50 }}
                itemKey={itemKey}
                itemData={itemData}
              >
                {tableRow}
              </List>
            )}
          </AutoSizer>
        </TableBody>
      </Table>

    </CTFragment>
  );
}


export default connectWithRedux(
  TransTable,
  [
    'transcriptions',
    'language'],
  [
    'setVideoTime',
    'setTranscriptions'
  ],
  ['media']
);
