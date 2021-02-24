import { MENU_HIDE, MENU_BEFORE_HIDE, CO_CHANGE_VIDEO, SMTAB_GENERAL, MODAL_HIDE, MODAL_BEFORE_HIDE } from '../Utils/constants.util';

export default {
    *menu_open({ payload: { type, option = 'a', tab } }, { call, put, select, take }) {
        yield put({ type: 'search_close' });
        const { watch } = yield select();
        if (option === 'b' && watch.menu === type) {
            yield put.resolve({ type: 'menu_close' })
            return;
        }
        yield put({ type: 'setMenu', payload: type })
        // Set tab, NOT IMPLEMENTED
    },
    *menu_close({ payload: { timeout = 200 } = {} }, { call, put, select, take }) {
        const { watch } = yield select();
        if (watch.menu === MENU_HIDE || !watch.menu) {
            return;
        }
        yield put.resolve({ type: 'setMenu', payload: MENU_BEFORE_HIDE });
        setTimeout(() => {
            put.resolve({ type: 'setMenu', payload: MENU_HIDE })
        }, timeout);
    },
    *modal_open({ payload: { type, option = 'a' } }, { call, put, select, take }) {
        yield put({ type: 'search_close' });
        const { watch } = yield select();
        if (option === 'b' && watch.modal === type) {
            yield put.resolve({ type: 'modal_close' })
        }
        yield put({ type: 'setModal', payload: type })
    },
    *modal_close({ payload: { timeout = 100 } = {} }, { call, put, select, take }) {
        const { watch } = yield select();
        if (watch.modal === MODAL_HIDE || !watch.modal) {
            return;
        }
        yield put.resolve({ type: 'setModal', payload: MODAL_HIDE });
        // todo: we wanna use css animation
        /*
        yield setTimeout(function* () {
            console.log('333')
            yield put({ type: 'setModal', payload:  })
        }, timeout);
        */
    }
}