import React, { useState, useEffect } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api, timestr } from 'utils';
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
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import { connectWithRedux } from '../../../controllers/trans';


function TransTime({
  time,
  setVideoTime,
  index
}) {
  const [currTime, setCurrTime] = useState(timestr.toSeconds(time));
  const [captionTime, setCaptionTime] = useState(time);
  const handleVideoTimeChange =
    () => {
      setVideoTime(currTime)
      setCurrTime(currTime + 0.01)
    }
  const handleTimeChange = (val) => {
    setCaptionTime(val.target.value)
  }

  useEffect(() => {
    setCurrTime(timestr.toSeconds(captionTime))
  }, [captionTime])
  return (
    <>
      <Button id="trans-time-btn" onClick={handleVideoTimeChange}>
        <CallMissedOutgoingIcon />
      </Button>
      <CTInput
        underlined
        value={captionTime}
        id="trans-time-edit"
        onChange={handleTimeChange}
      />
    </>
  );
}


export default connectWithRedux(
  TransTime,
  [
    'transcriptions',
    'language'],
  [
    'setVideoTime',
    'setTranscriptions'
  ],
  ['media']
);
