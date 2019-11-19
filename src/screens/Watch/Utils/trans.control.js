import $ from 'jquery'
import _ from 'lodash'
import { api } from 'utils'
import { timeStrToSec, colorMap, autoSize, /* autoSizeAllTextAreas */ } from './helpers'
import { videoControl } from './player.control'
import { promptControl } from './prompt.control'
import { preferControl } from './preference.control'
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
  ARRAY_EMPTY,
  PROFANITY_LIST,
  TRANSCRIPT_VIEW,
  LINE_VIEW,
} from './constants.util'
import { adSample } from './sampleData'

/**
 * @description The handlers for caption setting events
 * 
 */
export const transControl = {
  externalFunctions: {},

  /**
   * @param {Function} 
   * setTranscriptions, setCurrTrans, setTranscript, setCaptions, setCurrCaption, setDescriptions, setCurrDescription, 
   * setOpenCC, setCurrEditing, setOpenAD, setTransView
   * cc_setColor, cc_setBG, cc_setSize, cc_setOpacity, cc_setPosition, cc_setFont
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
    this.captions(data)
    let descriptions = adSample // need to modify
    this.descriptions(descriptions)
    let transcript = this.unionTranscript(this.captions(), this.descriptions())
    if (transcript.length === 0) transcript = ARRAY_EMPTY
    this.transcript(transcript)
  },

  /**
   * Descriptions
   * Action handlers for descriptions
   * **************************************************************************************************
   */
  descriptions_: [],
  currDescription_: {},
  prevDescription_: null,

  /**
   * Function called for get or set audio descriptions
   * @todo how??
   */
  descriptions: function(des) {
    if (des === undefined) return this.descriptions_
    des = _.map(des, d => ({...d, kind: WEBVTT_DESCRIPTIONS}))

    const { setDescriptions } = this.externalFunctions
    if (setDescriptions) {
      if (des.length === 0) des = ARRAY_EMPTY
      setDescriptions(des)
      this.descriptions_ = des
    }
  },

  findDescription: function(now) {
    let next = this.findCurrent(this.descriptions_, this.prevDescription_, now)
    this.prevDescription_ = next
    return next
  },
  /**
   * Function called for setting current description
   */
  updateDescription: function(desciption) {
    const { setCurrDescription } = this.externalFunctions
    if (setCurrDescription) {
      setCurrDescription(desciption)
      this.currDescription_ = desciption
    }
  },

  /**
   * Captions
   * Action handlers for captions
   * **************************************************************************************************
   */
  captions_: [],
  // caption of current time
  currCaption_: {},
  // the preverious
  prevCaption_: null,

  /**
   * Function called for setting captions array
   */
  captions: function(cap) {
    if (cap === undefined) return this.captions_
    cap = _.map(cap, c => ({...c, kind: WEBVTT_SUBTITLES}))
    const { setCaptions } = this.externalFunctions
    if (setCaptions) {
      if (cap.length === 0) cap = ARRAY_EMPTY
      this.captions_ = cap
      setCaptions(cap)
      this.prevCaption_ = null
    }
  },

  /**
   * Function Used to find the caption based on current time
   */
  findCaption: function(now) {
    let next = this.findCurrent(this.captions_, this.prevCaption_, now)
    this.prevCaption_ = next
    return next
  },

  /**
   * Function used to update the current caption
   */
  updateCaption: function(currCaption) {
    // if (!this.openCC_) return null;
    const { setCurrCaption } = this.externalFunctions
    // console.log('currCaption', currCaption.begin, currCaption.text)
    if (Boolean(currCaption) && Boolean(setCurrCaption)) {
      setCurrCaption(currCaption)
      this.currCaption_ = currCaption
      if (currCaption) this.autoSizeTextAreaByCaptionId(currCaption.id)
    }
  },

  /**
   * Transcript
   * Action handlers for transcript
   * **************************************************************************************************
   */
  // 
  transcript_: [],
  currTranscript_: {},
  // item that is being edited
  currEditing_: {},
  isEditing: false,
  editText: '',
  // true if mouse over trans box
  isMourseOverTrans: false,

  transcript: function(transcript_) {
    const { setTranscript, setCurrCaption } = this.externalFunctions
    this.transcript_ = transcript_
    if (setTranscript) setTranscript(transcript_)
    this.currCaption_ = transcript_[0] || null
    setCurrCaption(this.currCaption_)
  },

  updateTranscript: function(now) {
    let next = this.findCurrent(this.transcript_, this.prevCaption_, now)
    if (next && next.id) {
      if (next.kind === WEBVTT_DESCRIPTIONS) {
        this.updateDescription(next)
        if (preferControl.pauseWhileAD() && this.prevCaption_ !== next) videoControl.pause()
      } 
      this.prevCaption_ = next
      this.updateCaption(next)
      if (preferControl.autoScroll()) this.scrollTransToView(next.id)
    }
  },

  /**
   * Function called when editing selected caption
   */
  edit: function(caption) {
    // if no param caption, edit current caption
    if (caption === undefined) caption = this.currCaption_
    const { setCurrEditing } = this.externalFunctions
    this.isEditing = Boolean(caption)
    if (setCurrEditing) {
      setCurrEditing(caption)
      this.currEditing_ = caption
      if (Boolean(caption)) this.editText = caption.text
    }
  },
  /**
   * Function called for editing current caption
   */
  editCurrent: function() {
    let id = this.currCaption_.id
    $(`#caption-line-textarea-${id}`).focus()
  },

  /**
   * Functon called for input change as editing captions
   */
  handleChange: function(text) {
    this.editText = text
  },

  /**
   * Function called when save caption
   */
  saveEdition: async function() {
    const { setCurrEditing } = this.externalFunctions
    let text = this.editText
    /**
     * @todo check PROFANITY_LIST
     */
    if (!Boolean(text) || this.currEditing_.text === text) {
      this.editText = ''
      promptControl.closePrompt()
      return this.edit(null)
    }
    promptControl.savingCaption()
    this.isEditing = false

    if (setCurrEditing) {
      const { id } = this.currEditing_
      this.currEditing_.text = text
      setCurrEditing(null)
      try {
        await api.updateCaptionLine({ id, text })
        if (this.captions_.length > 0) {
          this.captions(this.captions_)
        }
        promptControl.savedCaption()
      } catch (error) {
        promptControl.savedCaption(false)
      }
    }
  },

  /**
   * Function called when mouse over the transcription area
   * To prevent scrolling
   */
  handleMourseOver: function(bool) {
    this.isMourseOverTrans = bool
  },
  /**
   * Function called when blurring on current editing caption
   */
  handleBlur: function() {
    this.isEditing = false
  },

  /**
   * Function that scrolls the captions
   */
  scrollTransToView: function(id) {
    if (this.isMourseOverTrans || this.isEditing) return;
    if (id === undefined && Boolean(this.currTrans_)) id = this.currTrans_.id
    if (!id) return;
    let capElem = document.getElementById(`caption-line-${id}`)
    let tranBox = document.getElementById('watch-trans-container')
    if (capElem) {
      capElem.classList.add('curr-line')
      let isTwoScreen = videoControl.isTwoScreen()
      let scrollTop = (window.innerWidth < 900 || !isTwoScreen) ? capElem.offsetTop - 10 : capElem.offsetTop - 80
      // if (preferControl.defaultTransView() === TRANSCRIPT_VIEW) scrollTop -= 400
      tranBox.scrollTop = scrollTop
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
  openCC_: preferControl.cc(),
  closedCaption: function(bool) {
    const { setOpenCC } = this.externalFunctions
    if (setOpenCC) {
      setOpenCC(bool)
      this.openCC_ = bool
      preferControl.cc(bool)
    }
  },
  handleOpenCC: function() {
    this.closedCaption( !this.openCC_ )
  },

  // Close or open AD
  openAD_: preferControl.ad(),
  audioDescription: function(bool) {
    const { setOpenAD } = this.externalFunctions
    if (setOpenAD) {
      setOpenAD(bool)
      this.openAD_ = bool
      preferControl.ad(bool)
    }
  },
  handleOpenAD: function() {
    this.audioDescription( !this.openAD_ )
  },

  // Switch trancript view
  transView: function(view) {
    const { setTransView } = this.externalFunctions
    if (setTransView) {
      setTransView(view)
      preferControl.defaultTransView(view)
    }
  },
  handleTransViewSwitch: function() {
    if (preferControl.defaultTransView() === LINE_VIEW) {
      this.transView(TRANSCRIPT_VIEW)
    } else {
      this.transView(LINE_VIEW)
    }
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
   * Function used to union two caption arrays 
   * Merging is based on the { begin, end } of each entry in the arrays
   */
  unionTranscript: function(captions, source) {
    if (captions === ARRAY_EMPTY) captions = []
    if (source === ARRAY_EMPTY) source = []
    let union = _.concat(captions, source)
    // console.error(union)
    union = _.sortBy(union, item => timeStrToSec(item.begin))
    union = _.map(union, (item, index) => ({...item, index}))
    return union
  },

  /**
   * Function used to find the transcription that matches the language
   */
  findTransByLanguage: function(language) {
    const transcriptions = this.transcriptions_
    return _.find(transcriptions, { language })
  },

  /**
   * Find item based on current time
   */
  findCurrent: function(array=[], prev={}, now=0) {
    let next = prev
    const isCurrent = item => {
      if (!item) return false
      let end = timeStrToSec(item.end)
      let begin =  timeStrToSec(item.begin)
      let deter = item.kind === WEBVTT_SUBTITLES || !prev 
                || item.kind !== prev.kind
                || (item.kind === WEBVTT_DESCRIPTIONS && item !== prev)
      return begin <= now && now <= end && deter
    }

    // if (isCurrent(prev)) {
    //   next = prev
    // }

    // if it's the first time to find captions
    if (!prev) {
      next = _.find(
        array, 
        isCurrent
      ) || null

    // if looking for caption that is after the current one
    } else if (now > timeStrToSec(prev.begin)) {
      next = _.find(
        array, 
        isCurrent,
        prev.index + 1
      ) || prev

    // if looking for caption that is prior to the current one
    } else if (now < timeStrToSec(prev.end)) {
      next = _.findLast(
        array, 
        isCurrent,
        prev.index - 1
      ) || prev
    }

    if (next) this.prev = next
    // if (next) console.error(next.kind)
    // else console.error('null')
    return next
  },

  autoSizeTextAreaByCaptionId: function(id) {
    autoSize($(`#caption-line-textarea-${id}`))
  },

}