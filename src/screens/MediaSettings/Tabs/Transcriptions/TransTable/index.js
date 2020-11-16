import React, { useState, useEffect, memo, useMemo } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api } from 'utils';
import { CTFragment, CTSelect } from 'layout';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { VariableSizeList as List, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import memoize from "memoize-one";
import { LanguageConstants } from 'components/CTPlayer'
import { connectWithRedux } from '../../../controllers/trans';
import TransTime from "../TransTime"
import TransText from "../TransText"
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';


function TransTable({
  media = undefined,
  transcriptions,
  language,
  setLanguage,
  setVideoTime,
  setTranscriptions,
  editingIndex,
  setEditingIndex,
  editing }) {
  const [captions, setCaptions] = useState([])

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
  const listRef = React.createRef();
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

  useEffect(() => {
    // console.log(editing);

  }, [editing])
  const tableRow = ({ index, style, data: { columns, items } }) => {
    const item = items[index];
    return (
      <>
        <TableRow
          component="div"
          style={{
            ...style,
          }}
          // onClick={() => {
          //   setEditingIndex(index)
          // }}
          className="msp-table-row"
        >
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
      </>
    );
  }

  const itemKey = (index, data_) => index;
  const createItemData = (columns, data_) => ({
    columns,
    items: data_
  });
  // id, operations, begin, end, text 
  const columns = [
    {
      label: "begin",
      dataKey: "begin",
    },
    {
      label: "end",
      dataKey: "end",
    },
    {
      label: "text",
      dataKey: "text"
    },
  ];
  // const [newData, setNewData] = useState(createItemData(columns, data));

  const itemData = createItemData(columns, data);
  const handleSelect = ({ target: { value } }) => setLanguage(value);
  return (
    <CTFragment id="msp-t-table-con" data-scroll>
      {/* <CTSelect
        value={language}
        onChange={handleSelect}
        options={LanguageConstants.LanguageOptions}
      ></CTSelect> */}
      <Table id="msp-trans-table">
        <TableHead component="div">
          <Button
            id="header-button-save"
            onClick={() => {
              console.log(itemData)
              itemData.items.splice(15, 0,
                createRow(
                  0,
                  captions[0].begin,
                  captions[0].end,
                  "NEW CAPTION"
                )
              )
              listRef.current.resetAfterIndex(0, true)
            }}
            startIcon={<SaveIcon />}
          >Save
          </Button>
          <Button id="header-button-cancel" startIcon={<CancelIcon />}>Cancel</Button>
        </TableHead>
        <TableBody component="div">
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                overscanCount={30}
                height={height - 60}
                width={width}
                itemCount={itemData.items.length}
                itemSize={() => 45}
                itemKey={itemKey}
                itemData={itemData}
                resetAfterIndex={0, false}
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
    'language',
    'editingIndex',
    'editing'
  ],
  [
    'setVideoTime',
    'setTranscriptions',
    'setLanguage',
    'setEditingIndex'
  ],
  ['media']
);
