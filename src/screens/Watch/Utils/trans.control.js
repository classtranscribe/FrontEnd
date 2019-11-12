import _ from 'lodash'
import { api } from 'utils'
import { timeStrToSec } from './helpers'

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

    // if it's the first time to find captions
    if (!lastCaption) {
      nextCaption = _.find(
        captions, 
        cap => {
          let end = timeStrToSec(cap.end)
          return now <= end
        }
      ) || null

    // if the intended caption is after the current one
    } else if (now < timeStrToSec(lastCaption.begin)) {
      nextCaption = _.findLast(
        captions, 
        cap => {
          let begin =  timeStrToSec(cap.begin)
          let end = timeStrToSec(cap.end)
          return begin <= now && now <= end
        }, 
        lastCaption.index - 2 // start at the previous one
      ) || lastCaption

    // if the intended caption is prior to the current one
    } else if (now > timeStrToSec(lastCaption.end)) {
      nextCaption = _.find(
        captions, 
        cap => {
          let begin =  timeStrToSec(cap.begin)
          let end = timeStrToSec(cap.end)
          return begin <= now && now <= end
        }, 
        lastCaption.index // start at the next one
      ) || lastCaption
    }

    this.lastCaption = nextCaption
    return nextCaption
  }
}