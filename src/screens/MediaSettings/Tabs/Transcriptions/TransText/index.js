import React, { useState, useEffect } from 'react';
import './index.scss';
import _ from 'lodash';
import { util, api } from 'utils';
import { CTFragment, CTInput } from 'layout';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/styles";
import { connectWithRedux } from '../../../controllers/trans';
import IconButton from '@material-ui/core/IconButton';
import HistoryIcon from '@material-ui/icons/History';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import Tooltip from '@material-ui/core/Tooltip';

function TransText({
  text,
  index,
}) {
  const [currText, setCurrText] = useState(text);
  const [tempText, setTempText] = useState(text);
  const [edit, setEdit] = useState(false);
  const handleCurrTextChange = (val) => {

    setCurrText(val.target.value)
  }
  // const onClick = () => {
  //   console.log(index)
  // }
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setEdit(!edit);
      setTempText(currText);
    }
  };
  return (
    <>
      {!edit ?
        <div onClick={() => {
          setEdit(true)
        }}
          id="msp-trans-text"
        >{currText}</div> :
        <div>
          <CTInput
            // onClick={onClick}
            underlined
            value={currText}
            id="msp-trans-text-edit"
            onChange={handleCurrTextChange}
            multiline
            rowsMax={1}
            onKeyDown={onKeyDown}
            autoFocus
          />
          <Tooltip title="Save">
            <IconButton id="msp-trans-text-save" onClick={() => {
              setEdit(!edit)
              setTempText(currText)
            }

            }
              legend="Save"
              disableRipple
            >
              <DoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton id="msp-trans-text-cancel" onClick={() => {
              setEdit(!edit);
              setCurrText(tempText);
            }

            }
              legend="Cancel"
              disableRipple
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton id="msp-trans-text-revert" onClick={() => {
              setEdit(!edit);
              setCurrText(text);
              setTempText(text);
            }}
              disableRipple
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </div>

      }


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
