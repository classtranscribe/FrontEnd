class CTPreferenceV2 {
  static LSTrue = 'true';
  static LSFalse = 'false';

  isValidVal(value) {
    return value !== undefined && value !== null;
  }

  getVal(key, altValue) {
    const value = localStorage.getItem(key);
    return this.isValidVal(value) ? value : altValue;
  }

  getNumVal(key, altValue) {
    try {
      return parseFloat(this.getVal(key, altValue));
    } catch (error) {
      return null;
    }
  }

  getJSONVal(key, altValue) {
    try {
      return JSON.parse(this.getVal(key, altValue));
    } catch (error) {
      return null;
    }
  }

  isTrue(key) {
    return this.getVal(key) === CTPreferenceV2.LSTrue;
  }

  isFalse(key) {
    return this.getVal(key) === CTPreferenceV2.LSFalse;
  }

  setVal(key, value) {
    const strVal = typeof value === 'string' ? value : value.toString();
    localStorage.setItem(key, strVal);
  }

  setJSONVal(key, json) {
    this.setVal(key, JSON.stringify(json));
  }

  setTrue(key) {
    this.setVal(key, CTPreferenceV2.LSTrue);
  }

  setFalse(key) {
    this.setVal(key, CTPreferenceV2.LSFalse);
  }

  setBool(key, bool) {
    if (bool) {
      this.setTrue(key);
    } else {
      this.setFalse(key);
    }
  }
}

export default CTPreferenceV2;