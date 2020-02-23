import {
  SET_MODAL,
  SET_PROMPT,
} from './global.action.types'

import { initialState } from './global.state'

const globalReducer = (
  state=initialState, 
  action
) => {

  const { type, value } = action

  switch (type) {
    case SET_MODAL  : return { ...state, modal: value }
    case SET_PROMPT : return { ...state, modal: value }
    default         : return state
  }
}

export default globalReducer