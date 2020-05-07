import { initialState } from './msp.state';
import {
    SET_MEDIA,
    SET_ERROR,
    SET_PLAYLIST,
} from './msp.action.types';

const mspReducer = (
    state=initialState,
    action
) => {

    const { type, value } = action;

    switch (type) {
        case SET_MEDIA            : return { ...state, media: value };
        case SET_PLAYLIST         : return { ...state, playlist: value };

        case SET_ERROR            : return { ...state, error: value };
        default                   : return state;
    }
}

export default mspReducer;