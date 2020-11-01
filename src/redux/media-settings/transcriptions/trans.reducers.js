import {
  SET_TRANSCRIPTIONS,
  SET_VIDEO_TIME,
  SET_LANGUAGE,
  SET_EDITING,
  INSERT_EDITING,
  SET_EDITING_INDEX
} from './trans.action.types';
import { initialState } from './trans.state';

const editingReducer = (state, value) => {
  state.map((item, index) => {
    if (item.index === (value.index - 1)) {
      return {
        ...item,
        begin: value.begin,
        end: value.end,
        text: value.text
      }
    }
    return item;
  }
  )
}

const transReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_TRANSCRIPTIONS:
      return { ...state, transcriptions: value };
    case SET_VIDEO_TIME:
      return { ...state, videoTime: value };
    case SET_LANGUAGE:
      return { ...state, language: value };
    case SET_EDITING:
      return { ...state, editing: editingReducer(state.editing, value) };
    case INSERT_EDITING:
      return { ...state, editing: [...state.editing, value] };
    case SET_EDITING_INDEX:
      return { ...state, editingIndex: value };
    default:
      return state;
  }
};

export default transReducer;