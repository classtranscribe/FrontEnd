import $ from 'jquery'
import _ from 'lodash'
import { api } from 'utils'
import { timeStrToSec, colorMap, autoSize, autoSizeAllTextAreas } from './helpers'
import { videoControl } from './player.control'
import { 
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_100,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,

  WEBVTT_SUBTITLES,
  WEBVTT_DESCRIPTIONS,
  ENGLISH,
} from './constants.util'
import { adSample } from './sampleData'

/**
 * @description The handlers for caption setting events
 * 
 */
export const transControl = {
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
   * @param {Function} setCurrEditing, cc_setColor, cc_setBG, cc_setSize, cc_setOpacity, cc_setPosition, cc_setFont
   */
  init: function(externalFunctions) {
    // console.log('externalFunctions', externalFunctions)
    this.externalFunctions = { ...this.externalFunctions, ...externalFunctions }
  },

  /**
   * Transcriptions
   * Action handlers for transcriptions
   * **************************************************************************************************
   */
  transcriptions_: [],
  currTrans_: {},

  /**
   * Function used to initialize transcriptions of the video
   */
  transcriptions: function(trans) {
    if (trans === undefined) return this.transcriptions_

    const { setTranscriptions } = this.externalFunctions
    if (setTranscriptions) {
      setTranscriptions(trans)
      this.transcriptions_ = trans
      // console.log('trans', trans)

      // Set the default current-transcription to be English
      const currTrans = this.findTransByLanguage(ENGLISH) //trans.find(tran => tran.language === 'en-US')
      if (currTrans) this.currTrans(currTrans)
    } 
  },

  /**
   * Function called for setting current transcription (aka language)
   */
  currTrans: async function(tran) {
    if (tran === undefined) return this.currTrans_
    if (!Boolean(tran.id)) return this.currTrans_

    // Set current transcription
    const { setCurrTrans } = this.externalFunctions
    if (setCurrTrans) setCurrTrans(tran)
    this.currTrans_ = tran
    // console.log('currTrans', tran)

    // Get and set corresponding captions
    let { data=[] } = await api.getCaptionsByTranscriptionId(tran.id)
    let descriptions = []//await this.audioDescriptions()
    let captions = this.mergeCaptions(data, descriptions, WEBVTT_DESCRIPTIONS)
    if (captions.length === 0) captions = ['empty']
    this.captions(captions)
  },

  /**
   * Function called for setting captions array
   */
  captions: function(cap) {
    const { setCaptions } = this.externalFunctions
    if (setCaptions) {
      this.captions_ = cap
      setCaptions(cap)
      this.lastCaption = null
      // console.log('captions', newCaptions)
      // autoSizeAllTextAreas(500)
    }
  },

  /**
   * @todo get array by vtt path
   */
  audioDescriptions: async function(path) {
    return adSample
  },


  /**
   * Captions
   * Action handlers for captions
   */
  captions_: [],
  // caption of current time
  currCaption_: {},
  // caption that is being edited
  editingCaption_: {},
  isEditing: false,
  // is true when mouse over that trans box
  isMourseOverTrans: false,
  /**
   * Function used to update the current caption
   */
  updateCaption: function(now) {
    // if (!this.openCC_) return null;
    const { setCurrCaption } = this.externalFunctions
    const currCaption = this.findCaption(now) || null
    // console.log('currCaption', currCaption.begin, currCaption.text)
    if (Boolean(currCaption) && Boolean(setCurrCaption)) {
      this.currCaption_ = currCaption
      setCurrCaption(currCaption)
      this.scrollTransToView(currCaption.id)
      this.autoSizeTextAreaByCaptionId(currCaption.id)
    }
  },

  /**
   * Function called when editing caption
   */
  editCaption: function(caption) {
    caption = caption || this.currCaption_
    const { setCurrEditing } = this.externalFunctions
    if (Boolean(caption) && setCurrEditing) {
      setCurrEditing(caption)
      this.isEditing = Boolean(caption)
      this.editingCaption_ = caption
    }
  },

  handleMourseOver: function(bool) {
    this.isMourseOverTrans = bool
  },
  handleBlur: function() {
    this.isEditing = false
  },

  /**
   * Function called when save caption
   */
  saveEdition: async function(text, index) {
    const { setCurrEditing } = this.externalFunctions
    if (setCurrEditing) {
      const { id } = this.editingCaption_
      setCurrEditing(null)
      try {
        await api.updateCaptionLine({ id, text })
        if (this.captions_.length > 0) {
          console.log(text)
          this.captions_[index].text = text
          this.captions(this.captions_)
        }
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  /**
   * Function that scrolls the captions
   */
  scrollTransToView: function(id) {
    if (this.isMourseOverTrans || this.isEditing) return;
    let capElem = document.getElementById(`caption-line-${id}`)
    let tranBox = document.getElementById('watch-trans-container')
    if (capElem) {
      capElem.classList.add('curr-line')
      tranBox.scrollTop = window.innerWidth > 900 ? capElem.offsetTop - 80 : capElem.offsetTop + 50
    }
  },




  /**
   * Handlers for open or close events
   * **************************************************************************************************
   */

   // Set current language
  setLanguage: function(language) {
    const currTrans = this.findTransByLanguage(language)
    if (Boolean(currTrans)) {
      this.currTrans(currTrans)
    }    
  },

  // Close or open CC
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

  



  /**
   * Functions for closed caption style setting
   * **************************************************************************************************
   */

  cc_color: CC_COLOR_WHITE, // cc_setColor
  cc_bg: CC_COLOR_BLACK, // cc_setBG
  cc_size: CC_SIZE_100, // cc_setSize
  cc_opacity: CC_OPACITY_100, // cc_setOpacity
  cc_font: CC_FONT_SANS_SERIF, // cc_setFont
  cc_position: CC_POSITION_BOTTOM, // cc_setPosition

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
      fontSize: `${cc_size + .25}rem`, // +.25 to get a larger default font size
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




  /**
   * Internal Helper Functions
   * **************************************************************************************************
   */

  /**
   * Function used to merge two caption arrays 
   * Merging is based on the { begin, end } of each entry in the arrays
   */
  mergeCaptions: function(oldCaptions, mergeCaptions, kind=WEBVTT_SUBTITLES) {
    if (!oldCaptions) oldCaptions = this.captions_ || []
    const mergeLen = mergeCaptions.length
    const oldLen = oldCaptions.length
    const newLen = mergeLen + oldLen
    const newCaptions = []
    let newIndex = 0
    let oldIndex = 0
    let mergeIndex = 0
    while (newIndex < newLen) {
      let item = {}
      if (oldIndex < oldLen) {
        item = oldCaptions[oldIndex]
        oldIndex += 1
        if (mergeIndex < mergeLen) {
          let currMergeItem = mergeCaptions[mergeIndex]
          if (item.begin > currMergeItem.begin) {
            currMergeItem.kind = kind
            item = currMergeItem
            oldIndex -= 1
            mergeIndex += 1
          }
        }
      } else if (mergeIndex < mergeLen) {
        item = mergeCaptions[mergeIndex]
        item.kind = kind
        mergeIndex += 1
      }

      newCaptions.push(item)
      newIndex += 1
    }
    
    return newCaptions
  },

  /**
   * Function used to find the transcription that matches the language
   */
  findTransByLanguage: function(language) {
    const transcriptions = this.transcriptions_
    return _.find(transcriptions, { language })
  },

  lastCaption: null,
  /**
   * Function Used to find the caption based on current time
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

    // if looking for caption that is prior to the current one
    } else if (now < timeStrToSec(lastCaption.begin)) {
      nextCaption = _.findLast(
        captions, 
        isCurrCaption,
        // cap => {
        //   let end = timeStrToSec(cap.end)
        //   return now <= end
        // }, 
        lastCaption.index
      ) || lastCaption

    // if looking for caption that is after the current one
    } else if (now > timeStrToSec(lastCaption.end)) {
      nextCaption = _.find(
        captions, 
        isCurrCaption,
        // cap => {
        //   let begin =  timeStrToSec(cap.begin)
        //   return begin <= now
        // }, 
        lastCaption.index
      ) || lastCaption
    }

    console.log('nextCaption', nextCaption)

    this.lastCaption = nextCaption
    return nextCaption
  },

  autoSizeTextAreaByCaptionId: function(id) {
    autoSize($(`#caption-line-textarea-${id}`))
  },

}