import _ from 'lodash';
import { _buildID } from 'utils';
import { ARRAY_INIT } from 'utils/constants';
import { LanguageConstants } from '../../CTPlayer';

export function _filterTrivalItems(epubData) {
  return [...epubData];
  // return _.filter(epubData, (item) => Boolean(_.trim(item.text)));
}
function getLastPunctuationIndex(sentence) {
  let lastPunctuationIndex = -1; 
  for (let i = sentence.length - 1; i >= 0; i -= 1) {
    if (sentence[i] === '.' || sentence[i] === '?' || sentence[i] === '!') {
      lastPunctuationIndex = i;
      break;
    }
  }
  return lastPunctuationIndex;
}

function _parseRawEPubDataSplittingOnPunctuation(rawEPubData) {
  let buffer = "";
  for (let i = 0; i < rawEPubData.length; i += 1) {
    let curr = (buffer + rawEPubData[i].text).trim();
    let idx = getLastPunctuationIndex(curr);
    if (idx === curr.length - 1) {
      rawEPubData[i].text = curr;
      buffer = "";
    } else {
      buffer = `${curr.substring(getLastPunctuationIndex(curr) + 1, curr.length) } `;
       rawEPubData[i].text = curr.substring(0, getLastPunctuationIndex(curr) + 1);
    }
  }
  return null;
}
export function _parseRawEPubData(rawEPubData) {
  let a = _.map(_filterTrivalItems(rawEPubData), item => ({ ...item, id: _buildID() }));
  _parseRawEPubDataSplittingOnPunctuation(a);
  return a;
}

export function _getMediaLangOptions(languages) {
  return languages.map(lang => ({
    text: LanguageConstants.decode(lang),
    value: lang
  }));
}
export function _generateDefaultEpubName(ePubs, defaultTitle) {
  // defaultTitle naming logic 
  if (ePubs.length > 0 && ePubs !== ARRAY_INIT) { // if there are previous epubs made 
    let mediaName = defaultTitle; // the default title 
    let mediaNameLen = mediaName.length;
    let maxAffix = -1; 
    for (const epub of ePubs) {
      let title = epub.title; 
      if (title.substring(0, mediaNameLen) === mediaName) { // if the title includes the default name 
        let diff = title.length - mediaName.length;  
        if (diff === 0) {  // if the title is exactly the default name 
          maxAffix = (maxAffix < 0) ? 0 : maxAffix;
        } else {
          let affix = title.substring((title.length - diff) + 1); // get the affix of this epub title  
          maxAffix = (parseInt(affix, 10) > maxAffix) ? affix : maxAffix; // if this affix is greater than max affix, set it  
        }
      }
    } 
    if (maxAffix > -1) {  // if we found other ebooks
      // increment maxAffix and set the name of this new ebook accordingly 
      maxAffix = parseInt(maxAffix, 10) + 1; 
      return `${mediaName}-${maxAffix}`
    }
  }
  return defaultTitle;
}
