import _ from 'lodash';
import { isMobile } from 'react-device-detect';
import { api } from 'utils';

import { promptControl } from './prompt.control';
import { uEvent } from './UserEventController';
import {
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_75,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
  WEBVTT_SUBTITLES,
  WEBVTT_DESCRIPTIONS,
  ENGLISH,
  ARRAY_EMPTY,
  // PROFANITY_LIST,
  TRANSCRIPT_VIEW,
  LINE_VIEW,
  HIDE_TRANS,
  CO_CHANGE_VIDEO,
  BULK_EDIT_MODE,
} from './constants.util';
// import { adSample } from './data'
// NOT IMPLEMENTED
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
  init(props) {

  },

  clear(opt = CO_CHANGE_VIDEO) {
    if (opt === CO_CHANGE_VIDEO) {
      this.transcriptions_ = [];
      this.currTrans_ = {};

      this.descriptions_ = [];
      this.currDescription_ = {};
      this.prevDescription_ = null;

      this.captions_ = [];
      this.currCaption_ = {};
      this.prevCaption_ = null;

      this.transcript_ = [];
      this.currTranscript_ = {};
      this.currEditing_ = {};
      this.isEditing = false;
      this.editText = '';
      this.isMourseOverTrans = false;
    }
  },

  /**
   * Transcriptions
   * Action handlers for transcriptions
   * **************************************************************************************************
   */
  transcriptions_: [],
  currTrans_: {},

  /**
   * Function called for setting current transcription (aka language)
   */
  async currTrans(tran) {
    // done
  },

  /**
   * Descriptions
   * Action handlers for descriptions
   * **************************************************************************************************
   */
  descriptions_: [],
  currDescription_: {},
  prevDescription_: null,

  findDescription(now) {
    const next = this.findCurrent(this.descriptions_, null, now);
    this.prevDescription_ = next;
    return next;
  },
  /**
   * Function called for setting current description
   */
  updateDescription(desciption) {
    const { setCurrDescription } = this.externalFunctions;
    if (setCurrDescription) {
      setCurrDescription(desciption);
      this.currDescription_ = desciption;
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
   * Function Used to find the caption based on current time
   */
  findCaption(now) {
    const deterFunc = (item, prev) => {
      return (
        item.kind === WEBVTT_SUBTITLES ||
        !prev ||
        item.kind !== prev.kind ||
        (item.kind === WEBVTT_DESCRIPTIONS && item !== prev)
      );
    };
    const next = this.findCurrent(this.captions_, this.prevCaption_, now, deterFunc);
    this.prevCaption_ = next;
    return next;
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

  /**
   * Function called when editing selected caption
   */
  edit(caption, innerText) {
    // if no param caption, edit current caption
    const currCap = caption || this.currCaption_;
    const { setCurrEditing } = this.externalFunctions;
    this.isEditing = Boolean(currCap);
    if (setCurrEditing) {
      setCurrEditing(currCap);
      this.currEditing_ = currCap;
      if (currCap) this.editText = innerText || currCap.text;
      /*
      if (preferControl.pauseWhileEditing()) {
        // videoControl.pause(); NOT IMPLEMENTED
      }
      if (preferControl.showCaptionTips()) {
        promptControl.editCaptionTips();
        preferControl.showCaptionTips(false);
      }
      */
    }
  },
  /**
   * Function called for editing current caption
   */
  editCurrent() {
    const id = this.currCaption_.id;
    const currTextArea = document.getElementById(`caption-line-textarea-${id}`);
    if (currTextArea) {
      currTextArea.focus();
      promptControl.editCaptionUsingKeyboard();
    }
  },

  /**
   * Functon called for input change as editing captions
   */
  handleChange(text) {
    this.editText = text;
  },

  /**
   * Function called when save caption
   */
  async handleSaveEditing() {
    const { setCurrEditing } = this.externalFunctions;
    const text = this.editText;
    /**
     * @todo check PROFANITY_LIST
     */
    if (!text || (this.currEditing_ && this.currEditing_.text === text)) {
      this.editText = '';
      promptControl.closePrompt();
      return this.edit(null);
    }
    promptControl.savingCaption();
    this.isEditing = false;

    if (setCurrEditing) {
      const { id } = this.currEditing_;
      // send user event
      // uEvent.edittrans(videoControl.currTime(), this.currEditing_.text, text); NOT IMPLEMENTED
      // update new text
      this.currEditing_.text = text;
      setCurrEditing(null);
      try {
        await api.updateCaptionLine({ id, text });
        if (this.captions_.length > 0) {
          this.captions(this.captions_);
        }
        promptControl.savedCaption();
      } catch (error) {
        promptControl.savedCaption(false);
      }
    }
  },

  handleCancelEditing() {
    const { setCurrEditing } = this.externalFunctions;
    if (setCurrEditing) {
      setCurrEditing(null);
      this.isEditing = false;
    }
  },

  /**
   * Function called when mouse over the transcription area
   * To prevent scrolling
   */
  handleMourseOver(bool) {
    this.isMourseOverTrans = bool;
  },
  /**
   * Function called when blurring on current editing caption
   */
  handleBlur() {
    // this.isEditing = false
    // this.edit(null)
  },

  /**
   * Handlers for bulk editing
   * **************************************************************************************************
   */
  bulkEditing_: false,
  transcriptCpy_: [],
  setTransCpy() { },
  bulkEdit(bool) {
    const { setBulkEditing } = this.externalFunctions;
    let bulkEditing = false;
    if (bool === undefined) {
      bulkEditing = !this.bulkEditing_;
    } else {
      bulkEditing = Boolean(bool);
    }

    setBulkEditing(bulkEditing);
    this.bulkEditing_ = bulkEditing;
    if (bulkEditing) {
      // videoControl.mode(BULK_EDIT_MODE, { sendUserAction: false }); NOT IMPLEMENTED
      this.transcriptCpy_ = _.cloneDeep(this.transcript_);
    } else {
      // videoControl.mode(null, { restore: true, sendUserAction: false }); NOT IMPLEMENTED
    }
  },

  bulkEditOnChange(index, key, value) {
    this.transcriptCpy_[index][key] = value;
  },

  bulkEditOnMergeDown(index) {
    if (this.transcriptCpy_[index + 1]) {
      this.transcriptCpy_[index].text += ` ${this.transcriptCpy_[index + 1].text}`;
      this.transcriptCpy_[index].end = this.transcriptCpy_[index + 1].end;

      this.bulkEditOnDelete(index + 1);
    }
  },

  bulkEditOnDelete(index) {
    // $(`#bulk-edit-capline-${index}`).fadeOut(() => {
    //   // _.remove(this.transcriptCpy_, (val, idx) => idx === index )
    //   // this.transcriptCpy_ = [ ...this.transcriptCpy_ ]
    //   // this.setTransCpy(this.transcriptCpy_)
    // })
    _.remove(this.transcriptCpy_, (val, idx) => idx === index);
    this.transcriptCpy_ = [...this.transcriptCpy_];
    this.setTransCpy(this.transcriptCpy_);
  },

  bulkEditOnInsert(index, kind = 'subtitles') {
    this.transcriptCpy_ = [
      ...this.transcriptCpy_.slice(0, index),
      {
        kind,
        index,
        id: '',
        begin: '00:00:00.00',
        end: '00:00:00.00',
        text: '',
        upVote: 0,
        downVote: 0,
        transcriptionId: this.transcriptCpy_[0].transcriptionId,
      },
      ...this.transcriptCpy_.slice(index),
    ];
    this.setTransCpy(this.transcriptCpy_);
  },

  /**
   * Functions for closed caption style setting
   * **************************************************************************************************
   */

  cc_color: CC_COLOR_WHITE, // cc_setColor
  cc_bg: CC_COLOR_BLACK, // cc_setBG
  cc_size: CC_SIZE_100, // cc_setSize
  cc_opacity: CC_OPACITY_75, // cc_setOpacity
  cc_font: CC_FONT_SANS_SERIF, // cc_setFont
  cc_position: CC_POSITION_BOTTOM, // cc_setPosition

  /**
   * Internal Helper Functions
   * **************************************************************************************************
   */
};
