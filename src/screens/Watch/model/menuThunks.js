import { createAsyncThunk } from '@reduxjs/toolkit';
import { MENU_HIDE, MODAL_HIDE } from '../Utils/constants.util';

export const sendMediaHistories = createAsyncThunk('watch/menu_open',
  async ({ type, option = 'a' }, { dispatch, getState }) => {
    dispatch({ type: 'watch/search_close' });
    const { watch } = getState()
    if (option === 'b' && watch.menu === type) {
      dispatch({ type: 'watch/menu_close' })
      return;
    }
    dispatch({ type: 'watch/setMenu', payload: type })
  }
);

export const menu_close = createAsyncThunk('watch/menu_close',
  async (_arg, { dispatch, getState }) => {
    const { watch } = getState()
    if (watch.menu === MENU_HIDE || !watch.menu) {
      return;
    }
    dispatch({ type: 'watch/setMenu', payload: MENU_HIDE });
    // setTimeout(() => {
    //     put.resolve({ type: 'setMenu', payload: MENU_HIDE })
    // }, timeout);
  }
);

export const modal_open = createAsyncThunk('watch/modal_open',
  async ({ type, option = 'a' }, { dispatch, getState }) => {
    dispatch({ type: 'watch/search_close' });
    const { watch } = getState();
    if (option === 'b' && watch.modal === type) {
      await dispatch({ type: 'watch/modal_close' });
    }
    await dispatch({ type: 'watch/setModal', payload: type });
  }
);

export const modal_close = createAsyncThunk('watch/modal_close',
  async (_args, { dispatch, getState }) => {
    const { watch } = getState();
    if (watch.modal === MODAL_HIDE || !watch.modal) {
      return;
    }
    dispatch({ type: 'watch/setModal', payload: MODAL_HIDE });
    // todo: we wanna use css animation
    /*
    yield setTimeout(function* () {
        console.log('333')
        yield put({ type: 'setModal', payload:  })
    }, timeout);
    */
  }
);

export const allMenuThunks = {
  sendMediaHistories,
  menu_close,
  modal_open,
  modal_close
}
