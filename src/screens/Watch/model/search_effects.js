import { api, elem, CTSearch } from 'utils';
import _ from 'lodash';
import {
  ARRAY_INIT,
  ARRAY_EMPTY,
  SEARCH_HIDE,
  SEARCH_BEGIN,
  SEARCH_RESULT,
} from '../Utils/constants.util';
import { shortcuts } from '../Utils/data';
import { isEarlier, isLater } from '../Utils/helpers';
import { uEvent } from '../Utils/UserEventController';
/*
 // Function used to update `search` state
  updateSearch(search) {
    const newSearch = { ...this.search_, ...search };
    this.search_ = newSearch;
    this.setSearch(newSearch);
  }
  
  // in progress. need to return a list of transID
  async getInCourseResult(value) {
    const { offeringId } = setup.playlist();
    if (!offeringId) return [];
    const data = await setup.getPlaylists(offeringId)
    const ok = await setup.getPlaylist(data[1].id)
    return ok;
  }
*/
function getShortcutResults(value) {
  let shortcuts_ = shortcuts.map((catag) => catag.rows);
  shortcuts_ = _.flatten(shortcuts_);
  const shortcutResults = CTSearch.getResults(shortcuts_, value, 'action', { flags: 'i' });
  return shortcutResults;
}
// Function used to get search results from videos in current offering
const getPlaylistResults = async (value, playlist) => {
  const { offeringId } = playlist;
  if (!offeringId) return [];

  try {
    const { data } = await api.searchForMedia(offeringId, value);
    return data;
  } catch (error) {
    console.error(error, 'Failed to get media results');
    return [];
  }
}
// Function used to add <span> tag around the searched value in a text
function highlightSearchedWords(results = [], value = '', key = 'text') {
  const tests = CTSearch.getRegExpTests(value, key);

  return results.map((res) => {
    let text = _.get(res, key).toLowerCase();
    tests.forEach((test) => {
      if (test.testFunc(res)) {
        text = _.replace(text, test.reg, `<span>${test.word}</span>`);
      }
    });

    return _.set(_.clone(res), key, text);
  });
}
// Function used to get search results from captions in current video
function getInVideoTransSearchResults(value, watch) {
  if (value === undefined) return watch.search;
  const captions = watch.transcript;;
  if (!value || captions === ARRAY_EMPTY) {
    return [];
  }

  let inVideoTransResults = CTSearch.getResults(captions, value, 'text', { flags: 'i' });
  inVideoTransResults = highlightSearchedWords(inVideoTransResults, value);

  // separate captions by current time
  const currentTime = watch.time;
  const inVideoTransResultsEarlier = _.filter(inVideoTransResults, isEarlier(currentTime));
  const inVideoTransResultsLater = _.filter(inVideoTransResults, isLater(currentTime));

  return {
    inVideoTransResultsEarlier,
    inVideoTransResultsLater,
  };
}
// Function used to get search results from captions in current offering
async function getInCourseTransSearchResults(value, playlist, lang) {
  const { offeringId } = playlist;
  if (!offeringId) return [];

  try {
    const { data } = await api.searchCaptionInOffering(offeringId, value, lang);
    return data;
  } catch (error) {
    console.error('Failed to get in-course trans search results');
    return [];
  }
}
export default {
  *search_open({ payload }, { call, put, select, take }) {
    const { watch } = yield select();
    if (watch.search.status !== SEARCH_HIDE) {
      elem.focus('watch-search-input');
      return;
    }
    const status = watch.search.hasResult ? SEARCH_RESULT : SEARCH_BEGIN;
    yield put({ type: 'setSearch', payload: { status } });
  },
  *search_close({ payload }, { put }) {
    yield put({ type: 'setSearch', payload: { status: SEARCH_HIDE } });
  },
  // Function used to get search results from captions and videos
  *search_getResults({ payload: value }, { call, put, select, take }) {
    if (!value) {
      return yield put({ type: 'resetSearch' })
    }
    const { watch } = yield select();
    // caption results in this video
    const {
      inVideoTransResultsEarlier,
      inVideoTransResultsLater,
    } = getInVideoTransSearchResults(value, watch);

    // shortcut results
    const shortcutResults = getShortcutResults(value);
    yield put({
      type: 'setSearch', payload: {
        value,
        status: SEARCH_RESULT,
        inVideoTransResults: [inVideoTransResultsEarlier, inVideoTransResultsLater],
        shortcutResults,
        playlistResults: ARRAY_INIT,
        inCourseTransResults: ARRAY_INIT,
      }
    });

    // playlist results
    const playlistResults = yield call(getPlaylistResults, value, watch.playlist);
    // caption results in this offering
    const inCourseTransResults =
      yield call(getInCourseTransSearchResults, value, watch.playlist, watch.currTrans?.language);
    yield put({ type: 'setSearch', payload: { inCourseTransResults, hasResult: true, playlistResults } });
    // send user action to logs
    uEvent.filtertrans(value);
  }
}