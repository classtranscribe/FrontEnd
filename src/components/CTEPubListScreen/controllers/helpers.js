import _ from 'lodash';
import { _buildID } from 'utils';
import { LanguageConstants } from '../../CTPlayer';
import { ARRAY_INIT } from 'utils/constants';

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

export function _generateDefaultEpubName(ePubs, defaultTitle) {
  // defaultTitle naming logic 
  if (ePubs.length > 0 && ePubs !== ARRAY_INIT) { // if there are previous epubs made 
    let mediaName = defaultTitle; // the default title 
    let mediaNameLen = mediaName.length;
    let maxAffix = -1; 
    for (const epub of ePubs) {
      let title = epub.title; 
      if (title.substring(0, mediaNameLen) == mediaName) { // if the title includes the default name 
        let diff = title.length - mediaName.length;  
        if (diff == 0) {  // if the title is exactly the default name 
          maxAffix = (0 > maxAffix) ? 0 : maxAffix;
        } else {
          let affix = title.substring((title.length - diff) + 1); // get the affix of this epub title  
          maxAffix = (parseInt(affix, 10) > maxAffix) ? affix : maxAffix; // if this affix is greater than max affix, set it  
        }
      }
    } 
    if (maxAffix > -1) {  // if we found other ebooks
      // increment maxAffix and set the name of this new ebook accordingly 
      maxAffix++; 
      return (mediaName + "-" + maxAffix);
    } else {  // if there is no prexisting ebooks, set to default title 
      return defaultTitle;
    }
  } else {
    return defaultTitle;
  }
}
