import React, { useState, useEffect } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api, timestr } from 'utils';
import { CTFragment, CTInput, CTAutoComplete } from 'layout';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from "@material-ui/styles";
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TimeField from 'react-simple-timefield';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Slider from '@material-ui/core/Slider';
import { connectWithRedux } from '../../../controllers/trans';


function TransTime({
  time,
  setVideoTime,
  index
}) {
  const [currTime, setCurrTime] = useState(timestr.toSeconds(time));
  const [captionTime, setCaptionTime] = useState(time);
  const [fraction, setFraction] = useState('00');
  const [shortTime, setShortTime] = useState('00:00:00');
  // const handleSelect = (val) => setOption(val.toString());
  // const handleSelect = (val) => setOption(val.toString());
  // const handleSelect = (val) => setOption(val.toString());
  const fractionOptions = [];
  for (let i = 0; i < 10; i += 1) {
    fractionOptions.push((i * 10).toString());
  }

  const handleVideoTimeChange =
    () => {
      setVideoTime(currTime)
      setCurrTime(currTime + 0.00001)
      // console.log(`trans-time-edit-${index}`)
    }
  const handleTimeChange = (val) => {
    setCaptionTime(val.target.value)
  }
  const handleShortTimeChange = (val) => {
    setShortTime(val.target.value)
  }
  const handleFractionChange = (val) => {
    setFraction(val.target.value)
  }

  // make sure the fractions are two digits
  useEffect(() => {
    if (parseInt(fraction, 10) < 10 && fraction.length < 2) setFraction('0' + fraction);
  }, [fraction])

  useEffect(() => {
    // if (captionTime.length > 11) {
    //   setCaptionTime(captionTime.slice(0, 11))
    // }
    setCurrTime(timestr.toSeconds(captionTime))
    // console.log(captionTime)
  }, [captionTime])
  useEffect(() => {
    let tempTime = captionTime.split('.')[1]
    if (tempTime) {
      tempTime = tempTime.substring(0, 2)
    }
    if (captionTime) {
      setShortTime(
        captionTime.split('.')[0]
      )
      setFraction(
        tempTime
      )
    }
  }, [])
  useEffect(() => {
    setCaptionTime(shortTime.concat('.').concat(fraction))
    // console.log(captionTime)
  }, [fraction, shortTime])


  // useEffect(() => {
  // }, [fraction, second, minute, hour])

  return (
    <>
      {/* <div >
        <IconButton className="trans-time-btn" onClick={handleVideoTimeChange} size="small">
          <CallMissedOutgoingIcon />
        </IconButton>
      </div> */}

      <div className="trans-time-edit">
        {/* <CTInput
          onClick={handleVideoTimeChange}
          underlined
          value={captionTime}
          onChange={handleTimeChange}
          margin="none"
        /> */}
        <TimeField
          onClick={handleVideoTimeChange}
          value={shortTime}
          input={<CTInput
            underlined
            margin="none"
          />}
          onChange={handleShortTimeChange}
          showSeconds
        />


        {/* <Button style={{ borderRadius: "5px", outline: "none", width: "5px", padding: "0 0 0 0" }}>
          {fraction}
        </Button> */}
        <input
          className="trans-time-fraction-edit"
          value={fraction}
          onClick={handleVideoTimeChange}
          onChange={handleFractionChange}
          type="number"
          max="99"
          min="00"
        // maxlength={2}
        />


        {/* <Autocomplete
          value={fraction}
        /> */}

      </div>

      {/* <Slider
        // value={parseInt(fraction)}
        onClick={handleVideoTimeChange}
        // onChange={handleFractionChange}
        max={99}
      /> */}
      {/* <Grid id="time-modifier">
        <Select
          native
          // multiple
          options={fractionOptions}
          value={fraction}
          onChange={handleSelect}></Select>
      </Grid> */}

    </>
  );
}


export default
  connectWithRedux(
    TransTime,
    [
      'language'],
    [
      'setVideoTime',
      'setTranscriptions'
    ],
    []
  );



