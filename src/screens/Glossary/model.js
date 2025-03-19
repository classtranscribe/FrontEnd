import pathToRegexp from 'path-to-regexp';
import ErrorTypes from 'entities/ErrorTypes';
import { api, prompt } from 'utils';
import { getGlossaryByOffering, getOffering } from './service';

const initState = {
  offeringId: "",
  courseId: "",
  courseName: "",
  termName: "",
  sectionName: "",
  glossary: []
}
const GlossaryModel = {
  namespace: 'glossary',
  state: { ...initState },
  reducers: {
    setGlossary(state, { payload }) {
      return { ...state, glossary: payload };
    },
    setOfferingId(state, { payload }) {
      return { ...state, offeringId: payload }
    },
    setOffering(state, { payload }) {
      const { courses, offering, term } = payload;
      return { ...state, courseId: courses[0]?.courseId, courseName: offering.courseName, termName: term.name, sectionName: offering.sectionName }
    }
  },
  effects: {
    *setupGlossary({ payload: { offeringId } }, { call, put, all }) {
      if (!offeringId) {
        return;
      }
      const [_glossary, _offering] = yield all([
        call(getGlossaryByOffering, offeringId),
        call(getOffering, offeringId)
      ]);
      api.contentLoaded(100);
      // console.log(_glossary);
      if (ErrorTypes.isError(_glossary) || ErrorTypes.isError(_offering)) {
        prompt.error('Failed to load glossary', 5000);
        return;
      }

      yield put({ type: "setOfferingId", payload: offeringId });
      yield put({ type: "setGlossary", payload: _glossary });
      yield put({ type: "setOffering", payload: _offering });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((event) => {
        const pathname = event.pathname ? event.pathname : event.location?.pathname
        const match = pathToRegexp('/glossary/:id?').exec(pathname);
        if (match) {
          dispatch({ type: 'setupGlossary', payload: { offeringId: match[1] } });
        }
      })
    }
  }
}
export default GlossaryModel