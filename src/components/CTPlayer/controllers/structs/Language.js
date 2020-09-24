import LConstants from '../constants/LanguageConstants';

/**
 * Struct for language items
 */
class Language {
  constructor(data = {}) {
    this.__data = {
      ...this.defaultData,
      ...data
    };
  }

  setLanguage(langCode) {
    this.__data = {
      code: langCode,
      text: LConstants.decode(langCode)
    };
  }

  getData() {
    return { ...this.__data };
  }

  get defaultData() {
    return {
      code: LConstants.English, 
      text: LConstants.decode(LConstants.English)
    };
  }

  get code() {
    return this.__data.code;
  }

  get text() {
    return this.__data.text;
  }
}

export default Language;