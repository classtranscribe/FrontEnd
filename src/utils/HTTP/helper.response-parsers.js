import { api  } from './index'
import { util } from '../index'
import { user } from '../user'
import { httpGET  } from './http.get'
import _ from 'lodash'
import { env } from 'utils/env'
const monthMap = require('../json/monthNames.json')

export const responseParsers = {
  completeSingleOffering: function(courseOffering, setOffering, index, currOfferings) {
    // set id for future use
    courseOffering.id = courseOffering.offering.id
    // get department acronym
    courseOffering.courses.forEach( course => {
      if (!user.isAdmin() && course.id === "test_course") courseOffering.isTestCourse = true
      httpGET.getDepartById(course.departmentId) 
        .then( ({data}) => {
          course.acronym = data.acronym
          if (index !== undefined) {
            currOfferings[index] = courseOffering
            setOffering(currOfferings)
          } else {
            setOffering(courseOffering)
          }
        })
    })
    // get term name
    httpGET.getTermById(courseOffering.offering.termId)
      .then(({data}) => {
        courseOffering.offering.termName = data.name
        if (index !== undefined) {
          currOfferings[index] = courseOffering
          setOffering(currOfferings)
        } else {
          setOffering(courseOffering)
        }
      })
  },

  parseSingleOffering: function(rawOffering) {
    const { offering, courses, term, instructorIds } = rawOffering
    let { universityId } = term
    let departmentIds = _.map(courses, 'departmentId')
    return {
      ...offering,
      departmentIds,
      universityId,
      instructorIds,
      termName: term.name,
      fullNumber: this.getFullNumber(courses),
      isTestCourse: _.findIndex(courses, { courseNumber: '000' }) >= 0 && !user.isAdmin(),
      instructor: instructorIds ? {
        ...(instructorIds[0] ? instructorIds[0] : {}),
        fullName: instructorIds[0] ? instructorIds[0].firstName + ' ' + instructorIds[0].lastName : ''
      } : null,
    }
  },
  
  parseOfferings: async function(rawOfferings) {
    const parsedOfferings = []
    for (let i = 0; i < rawOfferings.length; i++) {
      parsedOfferings.push(
        this.parseSingleOffering(rawOfferings[i])
      )
    }
    // console.log('parsedOfferings', parsedOfferings)
    return parsedOfferings
  },

  getFullNumber: function(courses, separator) {
    var name = ''
    courses.forEach( course => {
      name += (course.departmentAcronym || course.acronym || '') + course.courseNumber + (separator || '/')
    })
    name = name.slice(0, name.length - 1)
    return name
  },

  /**
   * Function used to parse media object
   * @param {Object} media the raw media object
   * @returns {Object} the uniformly parsed media object 
   * { id, createdAt, mediaName, sourceType, isTwoScreen, videos, transcriptions, isUnavailable, transReady }
   */
  parseMedia: function(media) {
    let re = { 
      id: '', 
      mediaName: '', 
      createdAt: '', 
      sourceType: 1,
      isTwoScreen: false, 
      videos: [], 
      transcriptions: [],
      isUnavailable: true,
      transReady: false,
    }

    // console.log(media)
    
    if (!media) return re
    const { 
      id, 
      playlistId, 
      name,
      jsonMetadata, 
      sourceType, 
      video, 
      transcriptions, 
      ready,
    } = media
    
    if (!id || !jsonMetadata) return re

    re.id = id
    re.createdAt = media.createdAt
    re.playlistId = playlistId
    re.sourceType = sourceType
    re.transReady = ready
    re.mediaName = _.replace(name, '.mp4', '')

    /** video src */
    const baseUrl = api.baseUrl()
    let srcPath1 = null
    let srcPath2 = null
    if (video) {
      // video1
      if (video.video1Path) srcPath1 = baseUrl + video.video1Path
      else if (video.video1 && video.video1.path) srcPath1 = baseUrl + video.video1.path
      // video2
      if (video.video2Path) srcPath2 = baseUrl + video.video2Path
      else if (video.video2 && video.video2.path) srcPath2 = baseUrl + video.video2.path
    }

    re.isUnavailable = !Boolean(srcPath1)
    re.isTwoScreen = Boolean(srcPath2)
    re.videos.push({ srcPath1, srcPath2 })

    /** Transcriptions */
    _.forEach(transcriptions, trans => {
      if (trans.file || trans.path) {
        re.transcriptions.push({
          id: trans.id,
          language: trans.language,
          src: `${api.baseUrl()}${trans.path || trans.file.path}`
        })
      }
    })

    return re
  },
  /** 
   * Returns the error status
   */
  parseError: function(error) {
    // console.log(JSON.stringify(error))
    const { response } = error
    if (!Boolean(response)) { // Server Error
      return { status: 500 }
    } 
    return { status: response.status }
  },
  isAuthError: function(error) {
    const { status } = this.parseError(error)
    return status === 401 || status === 403
  },
  getValidURLFullNumber: function(fullNumber) {
    return fullNumber.replace(/\//g, '-')
  },
  parseURLFullNumber: function(fullNumber) {
    fullNumber = fullNumber || util.parseSearchQuery().courseNumber
    return fullNumber.replace(/-/g, '/')
  },
}