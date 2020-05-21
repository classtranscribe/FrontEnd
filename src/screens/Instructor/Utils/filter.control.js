import _ from 'lodash';
import { api } from 'utils';
import { ARRAY_EMPTY } from './constants';

export const filterControl = {
  reverse(results = [], setResults) {
    if (results === ARRAY_EMPTY) return;
    setResults((results || []).slice().reverse());
  },

  // Function used to get RegExp tests for provided value
  getRegExpTests(value = '', keys = [], parser = (item) => item) {
    const tests = [];
    // get test functions for each word
    value.split(' ').forEach((word) => {
      const reg = new RegExp(_.escapeRegExp(word), 'i');

      const testFunc = (result) => {
        let re = false;
        if (keys.length === 0) {
          re = reg.test(result);
        } else {
          _.forEach(keys, (key) => {
            re = re || reg.test(_.get(parser(result), key));
          });
        }
        return re;
      };
      tests.push({ word, testFunc, reg });
    });

    return tests;
  },

  getMatchFunction(value = '', keys = [], parser) {
    const tests = this.getRegExpTests(value, keys, parser);
    // combine the test result
    const isMatch = (result) => {
      let match = false;
      tests.forEach((test) => {
        match = match || test.testFunc(result);
      });
      return match;
    };

    return isMatch;
  },

  filterOfferings(value, offerings, setResult) {
    if (!value) return setResult(offerings);
    const isMatch = this.getMatchFunction(value, [
      'courseNumber',
      'term.name',
      'sectionName',
      'depart.name',
    ]);

    const results = _.filter(offerings, isMatch);
    setResult(results);
  },

  filterPlaylists(value, playlists, setResult) {
    if (!value) return setResult(playlists);
    const isMatch = this.getMatchFunction(value, ['name']);

    const results = _.filter(playlists, isMatch);
    setResult(results);
  },

  filterMedias(value, medias, setResult) {
    if (!value) return setResult(medias);
    const isMatch = this.getMatchFunction(value, ['mediaName'], api.parseMedia);

    const results = _.filter(medias, isMatch);
    setResult(results);
  },

  filterEmails(value, emails, setResult) {
    if (!value) return setResult(emails);
    const isMatch = this.getMatchFunction(value, []);

    const results = _.filter(emails, isMatch);
    setResult(results);
  },
};
