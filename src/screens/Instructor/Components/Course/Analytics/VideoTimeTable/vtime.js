import _ from 'lodash'
import Papa from 'papaparse'
import { api } from '../../../../../../utils'
const fileDownload = require('js-file-download')

const A_VERY_OLD_DATE_ISO_STR = "2010-04-03T11:11:11.111Z"

export class VideoTimeLogsHandler {
  constructor() {
    this.logs = []
  }

  init({ offeringId, setParsedData, setTotal, setCaption }) {
    this.offeringId = offeringId
    this.setParsedData = setParsedData
    this.setTotal = setTotal
    this.setCaption = setCaption
  }

  download() {
    let csvList = this.logs.map(elem => ({ ...elem, totalVideoTime: elem.count }))
    _.forEach(csvList, log => delete log.count)
    const csvStr = Papa.unparse(csvList)
    fileDownload(csvStr, 'course_data.csv')
  }

  async setup() {
    const recentTimeupdates = await this.getRecentTimeUpdateLogs()
    // console.log('recentTimeupdates', recentTimeupdates)
    const editTransLogs = await this.getEditTransLogs()
    const totalTimeupdates = await this.getTotalTimeUpdateLogs()
    // console.log('totalTimeupdates', totalTimeupdates)
    const logs = this.combineLogs(
      totalTimeupdates, 
      recentTimeupdates,
      editTransLogs,
    )

    this.logs = [...logs]
    this.setTotal(logs)
  }

  parseLogs(data) {
    return _.map(
      data, 
      elem => ({
        email: elem.user ? elem.user.email : 'unknown', 
        ...
        _.reduce(
          elem.medias, 
          (total, media) => {
            for (let key in total) total[key] += media[key] || 0
            return total
          }, 
          { lastHr: 0, last3days: 0, lastWeek: 0, lastMonth: 0, count: 0, editTransCount: 0 })
      })
    )
  }

  async getRecentTimeUpdateLogs() {
    try {
      const { data } = await api.getCourseLogs('timeupdate', this.offeringId)
      return this.parseLogs(data)
    } catch (error) {
      console.error('Failed to get recent timeupdate logs.')
      return []
    }
  }

  async getEditTransLogs() {
    try {
      const { data } = await api.getCourseLogs(
        'edittrans', 
        this.offeringId, 
        A_VERY_OLD_DATE_ISO_STR, 
        new Date().toISOString()
      )

      return this.parseLogs(data)
    } catch (error) {
      console.error('Failed to get recent timeupdate logs.')
      return []
    }
  }

  async getTotalTimeUpdateLogs() {
    try {
      const { data } = await api.getCourseLogs(
        'timeupdate', 
        this.offeringId, 
        A_VERY_OLD_DATE_ISO_STR, 
        new Date().toISOString()
      )

      return this.parseLogs(data)
    } catch (error) {
      console.error('Failed to get total timeupdate logs.')
      return []
    }
  }

  combineLogs(totalTimeupdates=[], recentTimeupdates=[], editTransLogs=[]) {
    let logs = _.cloneDeep(totalTimeupdates)
    _.forEach(logs, elem => {
      let recentElem = _.find(recentTimeupdates, { email: elem.email })
      if (recentElem) {
        for (let key in elem) {
          if (typeof elem[key] === "number") {
            elem[key] += recentElem[key]
          }
        }
      }
    })

    _.forEach(editTransLogs, elem => {
      let timeElem = _.find(logs, { email: elem.email })
      if (timeElem) {
        timeElem.editTransCount = elem.count
      } else {
        logs.push({ 
          email: elem.email,
          lastHr: 0, last3days: 0, lastWeek: 0, lastMonth: 0, 
          count: 0, editTransCount: elem.count 
        })
      }
    })

    return _.reverse(_.sortBy(logs, 'count'))

    // console.log('totalTimeupdates', logs)
  }
}

export const vtime = new VideoTimeLogsHandler()