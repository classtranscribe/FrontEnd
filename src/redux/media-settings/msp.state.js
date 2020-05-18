import { api } from 'utils/cthttp';

export const initialState = {
    media: api.parseMedia(),
    playlist: {},

    error: null
};