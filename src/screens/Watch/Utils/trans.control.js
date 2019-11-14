import _ from 'lodash'
import { api } from 'utils'
import { timeStrToSec, colorMap } from './helpers'
import { 
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_100,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
} from './constants.util'

/**
 * @description The handlers for caption setting events
 * 
 */
export const transControl = {
  transcriptions_: [],
  captions_: [],
  currTrans_: {},
  externalFunctions: {},

  /**
   * 
   * @param {Object} externalFunctions 
   *                  the redux functions to register
   * @param {Function} externalFunctions.setTranscriptions  
   *                  set state function for transcriprions
   * @param {Function} externalFunctions.setCurrTrans  
   *                  set state function for current transcriprion
   * @param {Function} externalFunctions.setCaptions  
   *                  set state function for captions
   * @param {Function} externalFunctions.setOpenCC  
   *                  set state function for open or close cc
   * @param {Function} externalFunctions.setCurrCaption
   *                  set state funciton for current closed 
   * 
   * @param {Function} cc_setColor, cc_setBG, cc_setSize, cc_setOpacity, cc_setPosition, cc_setFont
   */
  init: function(externalFunctions) {
    // console.log('externalFunctions', externalFunctions)
    this.externalFunctions = { ...this.externalFunctions, ...externalFunctions }
  },

  transcriptions: function(trans) {
    if (trans === undefined) return this.transcriptions_

    const { setTranscriptions } = this.externalFunctions
    if (setTranscriptions) {
      setTranscriptions(trans)
      // console.log('trans', trans)
    } 
    this.transcriptions_ = trans

    const currTrans = trans.find(tran => tran.language === 'en-US')
    if (currTrans) this.currTrans(currTrans)
  },

  currTrans: async function(tran) {
    if (tran === undefined) return this.currTrans_
    if (!Boolean(tran.id)) return this.currTrans_

    const { setCurrTrans, setCaptions } = this.externalFunctions
    if (setCurrTrans) setCurrTrans(tran)
    // console.log('currTrans', tran)
    this.currTrans_ = tran
    const { data=[] } = await api.getCaptionsByTranscriptionId(tran.id)
    setCaptions(data)
    this.captions_ = data
    // console.log('captions', data)
  },

  setLanguage: function(language) {
    const currTrans = this.findTransByLanguage(language)
    if (Boolean(currTrans)) {
      this.currTrans(currTrans)
    }    
  },

  openCC_: false,
  closedCaption: function(bool) {
    const { setOpenCC } = this.externalFunctions
    if (setOpenCC) {
      setOpenCC(bool)
      this.openCC_ = bool
    }
  },
  handleOpenCC: function() {
    this.closedCaption( !this.openCC_ )
  },

  findTransByLanguage: function(language) {
    const transcriptions = this.transcriptions_
    return _.find(transcriptions, { language })
  },


  /**
   * Closed Caption
   */

  lastCaption: null,
  /**
   * Function Used to find the current caption
   * @param {Number} now 
   *        the current time
   * @return {Object} 
   *        current caption
   */
  findCaption: function(now) {
    let captions = this.captions_
    let lastCaption = this.lastCaption
    let nextCaption = lastCaption

    const isCurrCaption = cap => {
      let end = timeStrToSec(cap.end)
      let begin =  timeStrToSec(cap.begin)
      return begin <= now && now <= end
    }

    // if it's the first time to find captions
    if (!lastCaption) {
      nextCaption = _.find(
        captions, 
        isCurrCaption
      ) || null

    // if the intended caption is prior to the current one
    } else if (now < timeStrToSec(lastCaption.begin)) {
      nextCaption = _.findLast(
        captions, 
        isCurrCaption, 
        lastCaption.index - 1 // start at the previous one
      ) || lastCaption
      console.log('????????', nextCaption)

    // if the intended caption is after the current one
    } else if (now > timeStrToSec(lastCaption.end)) {
      nextCaption = _.find(
        captions, 
        isCurrCaption, 
        lastCaption.index // start at the next one
      ) || lastCaption
    }

    this.lastCaption = nextCaption
    return nextCaption
  },

  updateCaption: function(now) {
    if (!this.openCC_) return null;
    const { setCurrCaption } = this.externalFunctions
    const currCaption = this.findCaption(now) || null
    // console.log('currCaption', currCaption.begin, currCaption.text)
    if (currCaption) if (setCurrCaption) setCurrCaption(currCaption)
  },

  getCCStyle: function(options) {
    const { 
      cc_color=CC_COLOR_WHITE,
      cc_bg=CC_COLOR_BLACK,
      cc_size=CC_SIZE_100,
      cc_opacity=CC_OPACITY_100,
      cc_font=CC_FONT_SANS_SERIF,
      cc_position=CC_POSITION_BOTTOM,
    } = options

    const ccStyle = {
      backgroundColor: colorMap(cc_bg, cc_opacity),
      color: cc_color,
      fontSize: `${cc_size + .25}rem`,
      fontFamily: cc_font,
    }

    const ccContainerStyle = {}

    if (cc_position === 'top') {
      ccContainerStyle.top = '.7em'
    } else { // cc_position === 'bottom'
      ccContainerStyle.bottom = '.7em'
    }

    return { ccStyle, ccContainerStyle }
  },

  // cc_setColor, cc_setBG, cc_setSize, cc_setOpacity, cc_setPosition, cc_setFont
  cc_color: CC_COLOR_WHITE,
  cc_bg: CC_COLOR_BLACK,
  cc_size: CC_SIZE_100,
  cc_opacity: CC_OPACITY_100,
  cc_font: CC_FONT_SANS_SERIF,
  cc_position: CC_POSITION_BOTTOM,
  ccColor: function(value) {
    if (value === undefined) return this.cc_color
    const { cc_setColor } = this.externalFunctions
    if (cc_setColor) {
      cc_setColor(value)
      this.cc_color = value
    }
  },
  ccBG: function(value) {
    if (value === undefined) return this.cc_bg
    const { cc_setBG } = this.externalFunctions
    if (cc_setBG) {
      cc_setBG(value)
      this.cc_bg = value
    }
  },
  ccOpacity: function(value) {
    if (value === undefined) return this.cc_opacity
    const { cc_setOpacity } = this.externalFunctions
    if (cc_setOpacity) {
      cc_setOpacity(value)
      this.cc_opacity = value
    }
  },
  ccSize: function(value) {
    if (value === undefined) return this.cc_size
    const { cc_setSize } = this.externalFunctions
    if (cc_setSize) {
      cc_setSize(value)
      this.cc_size = value
    }
  },
  ccIncreaseSize: function() {
    if (!this.openCC_) return;
    const size = this.ccSize()
    if ( size + .25 <= 2 ) this.ccSize(size + .25)
  },
  ccDecreaseSize: function() {
    if (!this.openCC_) return;
    const size = this.ccSize()
    if ( size - .25 >= 0.75 ) this.ccSize(size - .25)
    console.log('size - .25', size - .25)
  },
  ccFont: function(value) {
    if (value === undefined) return this.cc_font
    const { cc_setFont } = this.externalFunctions
    if (cc_setFont) {
      cc_setFont(value)
      this.cc_font = value
    }
  },
  ccPosition: function(value) {
    if (value === undefined) return this.cc_position
    const { cc_setPosition } = this.externalFunctions
    if (cc_setPosition) {
      cc_setPosition(value)
      this.cc_position = value
    }
  },
}