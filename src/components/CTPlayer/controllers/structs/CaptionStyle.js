import PConstants from '../constants/PlayerConstants';

/**
 * Struct for caption styles
 */
class CaptionStyle {
  constructor(data = {}) {
    this.__data = {
      ...this.defaultData,
      ...data
    };
  }

  getData() {
    return { ...this.__data };
  }

  get defaultData() {
    return {
      fontSize: PConstants.CCFontSize100,
      fontColor: PConstants.CCColorWhite,
      opacity: PConstants.CCOpacity75,
      backgroundColor: PConstants.CCColorBlack,
      position: PConstants.CCPositionBottom
    };
  }

  get fontSize() {
    return this.__data.fontSize;
  }

  set fontSize(fontSize) {
    this.__data.fontSize = fontSize;
  }

  get fontColor() {
    return this.__data.fontColor;
  }

  set fontColor(fontColor) {
    this.__data.fontColor = fontColor;
  }

  get opacity() {
    return this.__data.opacity;
  }

  set opacity(opacity) {
    this.__data.opacity = opacity;
  }

  get backgroundColor() {
    return this.__data.backgroundColor;
  }

  set backgroundColor(backgroundColor) {
    this.__data.backgroundColor = backgroundColor;
  }
}

export default CaptionStyle;