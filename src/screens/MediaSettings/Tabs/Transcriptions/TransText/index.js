import React, { useState, useEffect } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api } from 'utils';
import { CTFragment, CTInput } from 'layout';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from "@material-ui/styles";
import { connectWithRedux } from '../../../controllers/trans';

function TransText({
  text,
  index
}) {
  const [currText, setCurrText] = useState(text);
  const handleCurrTextChange = (val) => {
    setCurrText(val.target.value)
  }
  return (
    <CTInput
      underlined
      value={currText}
      id="trans-text-btn"
      onChange={handleCurrTextChange}
      multiline
    />
    // <Button id="trans-text-btm">
    //   {text}
    // </Button>
  );
}


export default connectWithRedux(
  TransText,
  [
    'transcriptions',
    'language'],
  [
    'setVideoTime',
    'setTranscriptions'
  ],
  ['media']
);
