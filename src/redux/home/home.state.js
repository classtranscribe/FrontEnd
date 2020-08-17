import { ARRAY_INIT } from 'utils/constants';

export const initialState = {
  error: null,
  universities: ARRAY_INIT,
  departments: ARRAY_INIT,
  terms: ARRAY_INIT,
  selUniversity: null,
  selDepartments: [],
  selTerms: [],

  starredOfferings: ARRAY_INIT,
  watchHistory: ARRAY_INIT,
  offerings: ARRAY_INIT,
  sections: ARRAY_INIT
};