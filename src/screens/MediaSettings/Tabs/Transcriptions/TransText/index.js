import React, { useState, useEffect } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api } from 'utils';
import { CTFragment, CTInput } from 'layout';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/styles";
import { connectWithRedux } from '../../../controllers/trans';

function TransText({
  text,
  index,
}) {
  const [currText, setCurrText] = useState(text);
  const [editing, setEditing] = useState(false);
  const handleCurrTextChange = (val) => {
    setCurrText(val.target.value)
  }
  // const onClick = () => {
  //   console.log(index)
  // }
  return (
    <>
      <CTInput
        // onClick={onClick}
        underlined
        value={currText}
        id="msp-trans-text"
        onChange={handleCurrTextChange}
        multiline
        rowsMax={2}
      />
    </>
    // <Button id="trans-text-btm">
    //   {text}
    // </Button>
  );
}


export default connectWithRedux(
  TransText,
  [
    'language'],
  [
    'setVideoTime',
  ],
  []
);
