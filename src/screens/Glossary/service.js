import { api } from 'utils';
import ErrorTypes from 'entities/ErrorTypes';

export async function getGlossaryByOffering(offeringId) {
  try {
    const { data } = await api.getGlossary(offeringId);
    return data;
  } catch (error) {
    return ErrorTypes.getError(error);
  }
}

export async function getOffering(offeringId) {
  try {
    const { data } = await api.getOfferingById(offeringId);
    return data;
  } catch (error) {
    return ErrorTypes.getError(error);
  }
}