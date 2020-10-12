import LConstants from '../constants/LanguageConstants';
import PPrefer from '../PlayerPreference';

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

  setPreference(langCode) {
    PPrefer.setLanguage(langCode);
  }

  setLanguage(langCode) {
    this.__data = {
      code: langCode,
      text: LConstants.decode(langCode)
    };
    this.setPreference(langCode);
  }

  getData() {
    return { ...this.__data };
  }

  get defaultData() {
    const defaultLangCode = PPrefer.language || LConstants.English;
    return {
      code: defaultLangCode,
      text: LConstants.decode(defaultLangCode)
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