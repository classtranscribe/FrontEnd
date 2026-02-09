import LanguageConstants from './LanguageConstants';

describe('LanguageConstants', () => {
  describe('language codes', () => {
    it('exports English language code', () => {
      expect(LanguageConstants.English).toBe('en-US');
    });

    it('exports SimplifiedChinese language code', () => {
      expect(LanguageConstants.SimplifiedChinese).toBe('zh-Hans');
    });

    it('exports Korean language code', () => {
      expect(LanguageConstants.Korean).toBe('ko');
    });

    it('exports Spanish language code', () => {
      expect(LanguageConstants.Spanish).toBe('es');
    });

    it('exports French language code', () => {
      expect(LanguageConstants.French).toBe('fr');
    });
  });

  describe('LangMap', () => {
    it('maps language codes to names', () => {
      expect(LanguageConstants.LangMap['en-US']).toBe('English');
      expect(LanguageConstants.LangMap['zh-Hans']).toBe('Simplified Chinese');
      expect(LanguageConstants.LangMap.ko).toBe('Korean');
      expect(LanguageConstants.LangMap.es).toBe('Spanish');
      expect(LanguageConstants.LangMap.fr).toBe('French');
    });

    it('has all supported languages', () => {
      expect(Object.keys(LanguageConstants.LangMap).length).toBe(5);
    });
  });

  describe('LanguageOptions', () => {
    it('returns array of language options', () => {
      const options = LanguageConstants.LanguageOptions;
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBe(5);
    });

    it('returns options with value and text properties', () => {
      const options = LanguageConstants.LanguageOptions;
      options.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('text');
        expect(typeof option.value).toBe('string');
        expect(typeof option.text).toBe('string');
      });
    });

    it('includes English option', () => {
      const options = LanguageConstants.LanguageOptions;
      const englishOption = options.find(opt => opt.value === 'en-US');
      expect(englishOption).toBeDefined();
      expect(englishOption.text).toBe('English');
    });
  });

  describe('decode', () => {
    it('decodes English language code', () => {
      expect(LanguageConstants.decode('en-US')).toBe('English');
    });

    it('decodes SimplifiedChinese language code', () => {
      expect(LanguageConstants.decode('zh-Hans')).toBe('Simplified Chinese');
    });

    it('decodes Korean language code', () => {
      expect(LanguageConstants.decode('ko')).toBe('Korean');
    });

    it('decodes Spanish language code', () => {
      expect(LanguageConstants.decode('es')).toBe('Spanish');
    });

    it('decodes French language code', () => {
      expect(LanguageConstants.decode('fr')).toBe('French');
    });

    it('returns undefined for unknown language code', () => {
      expect(LanguageConstants.decode('unknown')).toBeUndefined();
    });
  });

  describe('encode', () => {
    it('encodes English language name', () => {
      expect(LanguageConstants.encode('English')).toBe('en-US');
    });

    it('encodes Simplified Chinese language name', () => {
      expect(LanguageConstants.encode('Simplified Chinese')).toBe('zh-Hans');
    });

    it('encodes Korean language name', () => {
      expect(LanguageConstants.encode('Korean')).toBe('ko');
    });

    it('encodes Spanish language name', () => {
      expect(LanguageConstants.encode('Spanish')).toBe('es');
    });

    it('encodes French language name', () => {
      expect(LanguageConstants.encode('French')).toBe('fr');
    });

    it('returns null for unknown language name', () => {
      expect(LanguageConstants.encode('Unknown Language')).toBeNull();
    });

    it('is case-sensitive', () => {
      expect(LanguageConstants.encode('english')).toBeNull();
    });
  });
});
