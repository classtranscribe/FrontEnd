import _ from 'lodash';
import { _buildID } from 'utils';
import { LanguageConstants } from '../../CTPlayer';

export function _filterTrivalItems(epubData) {
  return [...epubData];
  // return _.filter(epubData, (item) => Boolean(_.trim(item.text)));
}

export function _parseRawEPubData(rawEPubData) {
  return _.map(_filterTrivalItems(rawEPubData), item => ({ ...item, id: _buildID() }));
}

export function _getMediaLangOptions(languages) {
  return languages.map(lang => ({
    text: LanguageConstants.decode(lang),
    value: lang
  }));
}

