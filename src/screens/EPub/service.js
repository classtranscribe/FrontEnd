import { api, prompt, links, timestr, uurl, elem, ARRAY_INIT } from 'utils';
import ErrorTypes from 'entities/ErrorTypes';

export async function getEPubById(ePubId) {
    try {
        const { data } = await api.getEPubById(ePubId);
        return data;
    } catch (error) {
        return ErrorTypes.getError(error);
    }
}
export async function getMediaById(mediaId) {
    try {
        const { data } = await api.getMediaById(mediaId);
        return api.parseMedia(data);
    } catch (error) {
        return ErrorTypes.getError(error);
    }
}