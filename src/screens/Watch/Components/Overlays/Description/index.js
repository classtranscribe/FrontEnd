import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import { 
  transControl,
} from '../../../Utils'


export const ClosedCaption = connectWithRedux(
  ClosedCaptionWithRedux,
  [],
  []
)