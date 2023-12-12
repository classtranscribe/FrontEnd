import { MENU_HIDE,MODAL_HIDE } from '../Utils/constants.util';

export default {
    *menu_open({ payload: { type, option = 'a' } }, { put, select}) {
        yield put({ type: 'search_close' });
        const { watch } = yield select();
        if (option === 'b' && watch.menu === type) {
            yield put.resolve({ type: 'menu_close' })
            return;
        }
        yield put({ type: 'setMenu', payload: type })
        // Set tab, NOT IMPLEMENTED
    },
    // eslint-disable-next-line no-unused-vars
    *menu_close(_unused , { put, select}) {
        const { watch } = yield select();
        if (watch.menu === MENU_HIDE || !watch.menu) {
            return;
        }
        yield put.resolve({ type: 'setMenu', payload: MENU_HIDE });
        // setTimeout(() => {
        //     put.resolve({ type: 'setMenu', payload: MENU_HIDE })
        // }, timeout);
    },
    *modal_open({ payload: { type, option = 'a' } }, { put, select}) {
        yield put({ type: 'search_close' });
        const { watch } = yield select();
        if (option === 'b' && watch.modal === type) {
            yield put.resolve({ type: 'modal_close' })
        }
        yield put({ type: 'setModal', payload: type })
    },
        // eslint-disable-next-line no-unused-vars

    *modal_close( _unused, { put, select}) {
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