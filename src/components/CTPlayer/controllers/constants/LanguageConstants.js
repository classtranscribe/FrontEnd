/**
 * The class contains all the static values for languages
 */
class LanguageConstants {
  /// /////////////////////////////////////////////////////////////////////////////
  // Language Constants
  /// /////////////////////////////////////////////////////////////////////////////
  // languages
  static English = 'en-US';
  static SimplifiedChinese = 'zh-Hans';
  static Korean = 'ko';
  static Spanish = 'es';
  static French = 'fr';
  static LangMap = {
    [LanguageConstants.English]: 'English',
    [LanguageConstants.SimplifiedChinese]: 'Simplified Chinese',
    [LanguageConstants.Korean]: 'Korean',
    [LanguageConstants.Spanish]: 'Spanish',
    [LanguageConstants.French]: 'French',
  };

  static get LanguageOptions() {
    return Object.keys(LanguageConstants.LangMap).map(
      value => ({ value, text: LanguageConstants.LangMap[value] })
    );
  }

  /**
   * Get the language name
   * @param {String} langCode the code of the language
   * @returns {String} the readable name of the language
   */
  static decode(langCode) {
    return LanguageConstants.LangMap[langCode];
  }

  /**
   * Get the language code
   * @param {String} langName the name of the language
   * @returns {String} the code of the language
   */
  static encode(langName) {
    let code = null;
    Object.keys(LanguageConstants.LangMap).forEach(value => {
      if (LanguageConstants.LangMap[value] === langName) {
        code = value;
      }
    });

    return code;
  }
}

export default LanguageConstants;