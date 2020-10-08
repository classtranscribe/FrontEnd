import PConstants from '../constants/PlayerConstants';
import PPrefer from '../PlayerPreference';

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

  static setPreference(ccStyle) {
    const ccStyleStr = [
      ccStyle.fontSize || PConstants.CCFontSize100, // fontSize
      ccStyle.fontColor || PConstants.CCColorWhite, // fontColor
      ccStyle.opacity === undefined ? PConstants.CCOpacity75 : ccStyle.opacity, // opacity
      ccStyle.backgroundColor || PConstants.CCColorBlack, // backgroundColor
      ccStyle.position || PConstants.CCPositionBottom, // position
    ].join(';');
    PPrefer.setCCStyle(ccStyleStr);
  }

  get defaultDataStr() {
    return [
      PConstants.CCFontSize100, // fontSize
      PConstants.CCColorWhite, // fontColor
      PConstants.CCOpacity75, // opacity
      PConstants.CCColorBlack, // backgroundColor
      PConstants.CCPositionBottom, // position
    ].join(';');
  }

  get defaultData() {
    if (!PPrefer.ccStyle) {
      PPrefer.setCCStyle(this.defaultDataStr);
    }

    const rawCCStyles = PPrefer.ccStyle.split(';');
    return {
      fontSize: parseFloat(rawCCStyles[0]),
      fontColor: rawCCStyles[1],
      opacity: parseFloat(rawCCStyles[2]),
      backgroundColor: rawCCStyles[3],
      position: rawCCStyles[4],
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