import { api } from 'utils';
import ErrorTypes from 'entities/ErrorTypes';

export async function getEPubById(ePubId) {
  try {
    const { data } = await api.getEPubById(ePubId);
    const source = await api.getMediaById(data.sourceId);
    data.jsonMetadata = source.data.jsonMetadata;
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
