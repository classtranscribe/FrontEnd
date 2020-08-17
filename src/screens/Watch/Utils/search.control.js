import _ from 'lodash';

import { api, elem, userAction, CTSearch } from 'utils';
import { setup } from './setup.control';
import { transControl } from './trans.control';
import { videoControl } from './player.control';
import { isEarlier, isLater } from './helpers';

import {
  SEARCH_INIT,
  ARRAY_INIT,
  ARRAY_EMPTY,
  SEARCH_HIDE,
  SEARCH_BEGIN,
  SEARCH_RESULT,
  SEARCH_PAGE_NUM,
  SEARCH_TRANS_IN_VIDEO,
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_PLAYLISTS,
  SEARCH_IN_SHORTCUTS,
} from './constants.util';

import { shortcuts } from './data';

/**
 * Functions for controlling user preference
 */

class WatchSearch extends CTSearch {
  constructor() {
    super();

    this.search_ = SEARCH_INIT;
    this.hasResult = false;

    // used to determine whether already has a result ot not
    // Function used to set search state
    this.setSearch = function () {};
  }

  options = [
    SEARCH_TRANS_IN_VIDEO,
    SEARCH_IN_PLAYLISTS,
    SEARCH_TRANS_IN_COURSE,
    SEARCH_IN_SHORTCUTS,
  ];

  // Function used to set up the external objects & functions used by searching
  init({ setSearch }) {
    if (setSearch) this.setSearch = setSearch;
    this.resetResult();
  }

  // Function used to update `search` state
  updateSearch(search) {
    const newSearch = { ...this.search_, ...search };
    this.search_ = newSearch;
    this.setSearch(newSearch);
  }

  // Function used to open search
  openSearch() {
    if (this.search_.status !== SEARCH_HIDE) {
      elem.focus('watch-search-input');
      return;
    }

    const status = this.hasResult ? SEARCH_RESULT : SEARCH_BEGIN;
    this.updateSearch({ status });
  }

  // Function used to close search
  closeSearch() {
    if (this.search_.status === SEARCH_HIDE) return;
    this.updateSearch({ status: SEARCH_HIDE });
  }

  // Function used to auto handle close or open search
  handleOpen(bool) {
    if (bool === undefined) {
      if (this.search_.status === SEARCH_HIDE) {
        this.openSearch();
      } else {
        this.closeSearch();
      }
    } else if (bool) {
      this.openSearch();
    } else {
      this.closeSearch();
    }
  }

  // Function used to reset search value & results
  resetResult(status = SEARCH_HIDE) {
    this.updateSearch({
      status,
      value: '',
      inVideoTransResults: ARRAY_INIT,
      inCourseTransResults: ARRAY_INIT,
      playlistResults: ARRAY_INIT,
    });

    this.hasResult = false;
  }

  // Function used to add <span> tag around the searched value in a text
  highlightSearchedWords(results = [], value = '', key = 'text') {
    const tests = this.getRegExpTests(value, key);

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
  getInVideoTransSearchResults(value) {
    if (value === undefined) return this.search_;
    const captions = transControl.transcript();
    if (!value || captions === ARRAY_EMPTY) {
      return [];
    }

    let inVideoTransResults = this.getResults(captions, value, 'text', { flags: 'i' });
    inVideoTransResults = this.highlightSearchedWords(inVideoTransResults, value);

    // separate captions by current time
    const currentTime = videoControl.currTime();
    const inVideoTransResultsEarlier = _.filter(inVideoTransResults, isEarlier(currentTime));
    const inVideoTransResultsLater = _.filter(inVideoTransResults, isLater(currentTime));

    return {
      inVideoTransResultsEarlier,
      inVideoTransResultsLater,
    };
  }

  // Function used to get search results from captions in current offering
  async getInCourseTransSearchResults(value) {
    const { offeringId } = setup.playlist();
    if (!offeringId) return [];

    try {
      const { data } = await api.searchCaptionInOffering(offeringId, value);
      return data;
    } catch (error) {
      console.error('Failed to get in-course trans search results');
      return [];
    }
  }

  // Function used to get search results from videos in current offering
  async getPlaylistResults(value) {
    const { offeringId } = setup.playlist();
    if (!offeringId) return [];

    try {
      const { data } = await api.searchForMedia(offeringId, value);
      return data;
    } catch (error) {
      console.error(error, 'Failed to get media results');
      return [];
    }
  }

  getShortcutResults(value) {
    let shortcuts_ = shortcuts.map((catag) => catag.rows);
    shortcuts_ = _.flatten(shortcuts_);
    const shortcutResults = this.getResults(shortcuts_, value, 'action', { flags: 'i' });
    return shortcutResults;
  }

  // Function used to get search results from captions and videos
  async getAllResults(value) {
    if (!value) {
      return this.resetResult();
    }

    // caption results in this video
    const {
      inVideoTransResultsEarlier,
      inVideoTransResultsLater,
    } = this.getInVideoTransSearchResults(value);

    // shortcut results
    const shortcutResults = this.getShortcutResults(value);
    this.updateSearch({
      value,
      status: SEARCH_RESULT,
      inVideoTransResults: [inVideoTransResultsEarlier, inVideoTransResultsLater],
      shortcutResults,
      playlistResults: ARRAY_INIT,
      inCourseTransResults: ARRAY_INIT,
    });

    // playlist results
    const playlistResults = await this.getPlaylistResults(value);
    this.updateSearch({ playlistResults });

    // caption results in this offering
    const inCourseTransResults = await this.getInCourseTransSearchResults(value);
    this.updateSearch({ inCourseTransResults });
    this.hasResult = true;

    // send user action to logs
    userAction.filtertrans(value);
  }

  /**
   * Helper functions
   */

  // Function used to get the number of results
  resultNum(results) {
    if (results === ARRAY_INIT || results === ARRAY_EMPTY) {
      return 0;
    }

    return results.length;
  }

  // Function used to get the options for results
  getResultOptions(search = SEARCH_INIT) {
    const {
      inVideoTransResults = [],
      inCourseTransResults = [],
      playlistResults = [],
      shortcutResults = [],
    } = search;

    const optNumMap = {
      [SEARCH_TRANS_IN_VIDEO]: [_.flatten(inVideoTransResults), 'caption', 'video'],
      [SEARCH_IN_PLAYLISTS]: [playlistResults, 'video title', 'course'],
      [SEARCH_TRANS_IN_COURSE]: [inCourseTransResults, 'caption', 'course'],
      [SEARCH_IN_SHORTCUTS]: [shortcutResults, 'shortcut', 'page'],
    };

    // let defaultOpt = preferControl.defaultSearchOption() || SEARCH_TRANS_IN_VIDEO;

    const options = this.options
      .map((opt) => {
        const [res, name, range] = optNumMap[opt];
        const num = this.resultNum(res);
        const init = res === ARRAY_INIT;
        return {
          opt,
          num,
          init,
          // current: opt === defaultOpt,
          content: `${num >= 100 ? '99+' : num} ${name}${num > 1 ? 's' : ''} in this ${range}`,
        };
      })
      .filter((opt) => opt.num !== 0 || opt.init);

    return options;
  }

  // Function used to get the total page num based on a result's length
  totalPageNum(resultLen = 0) {
    return resultLen === 0 ? 1 : Math.ceil(resultLen / SEARCH_PAGE_NUM);
  }

  // Function used to determine whether an item is in current page
  isInCurrentPage(page = 0, index = 0) {
    return index < page * SEARCH_PAGE_NUM && index >= (page - 1) * SEARCH_PAGE_NUM;
  }
}

export const searchControl = new WatchSearch();
