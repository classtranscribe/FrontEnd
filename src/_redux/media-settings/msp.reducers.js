import {
  SET_MEDIA,
  SET_TAB,
} from './msp.action.types'
import { initialState } from './msp.state'

const mspReducer = (
  state=initialState,
  action
) => {

  const { type, value } = action

  switch (type) {
    case SET_MEDIA    : return { ...state, media: value }
    case SET_TAB      : return { ...state, tab: value }
  
    default           : return state
  }
}

export default mspReducer