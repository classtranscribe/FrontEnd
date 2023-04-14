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

  //  findDescription(now) {
  //  // NOT IMPLEMENTED
  //  const next = this.findCurrent(this.descriptions_, null, now);
  //  this.prevDescription_ = next;
  //  return next;
  //  },
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

  /**
   * Function called for editing current caption
   */
  editCurrent() {
    // NOT IMPLEMENTED
    const id = this.currCaption_.id;
    const currTextArea = document.getElementById(`caption-line-textarea-${id}`);
    if (currTextArea) {
      currTextArea.focus();
      promptControl.editCaptionUsingKeyboard();
    }
  },


  /**
   * Function called when mouse over the transcription area
   * To prevent scrolling
   */
  handleMourseOver(bool) {
    // isMourseOverTrans
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
};
