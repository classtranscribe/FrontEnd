

class Languages {
  // languages
  static English = 'en-US';
  static SimplifiedChinese = 'zh-Hans';
  static Korean = 'ko';
  static Spanish = 'es';
  static French = 'fr';
  static LangMap = {
    [Languages.English]: 'English',
    [Languages.SimplifiedChinese]: 'Simplified Chinese',
    [Languages.Korean]: 'Korean',
    [Languages.Spanish]: 'Spanish',
    [Languages.French]: 'French',
  };

  static get LanguageOptions() {
    return Object.keys(Languages.LangMap).map(
      value => ({ value, text: Languages.LangMap[value] })
    );
  }

  /**
   * Get the language name
   * @param {String} langCode the code of the language
   * @returns {String} the readable name of the language
   */
  static decode(langCode) {
    return Languages.LangMap[langCode];
  }

  /**
   * Get the language code
   * @param {String} langName the name of the language
   * @returns {String} the code of the language
   */
  static encode(langName) {
    let code = null;
    Object.keys(Languages.LangMap).forEach(value => {
      if (Languages.LangMap[value] === langName) {
        code = value;
      }
    });

    return code;
  }
}

export default Languages;