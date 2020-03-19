import { CTPreference } from '../../../utils'

const DNNN_COMBINE = 'msp-dnnn-combine' // Do not nofity next time for combining

export class MSPPreference extends CTPreference {
  constructor() {
    super()

    // Do not nofity next time for combining
    this[DNNN_COMBINE] = this.isTrue(DNNN_COMBINE)
  }

  init(props) {

  }
  
  dnnnCombine() {
    return this.localStorage(DNNN_COMBINE, true)
  }
}

export const prefControl = new MSPPreference()