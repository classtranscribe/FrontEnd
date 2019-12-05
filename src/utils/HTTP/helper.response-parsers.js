import { api  } from './index'
import { util } from '../index'
import { user } from '../user'
import { httpGET  } from './http.get'
import { httpPOST } from './http.post'
import { deviceType, osVersion, osName, fullBrowserVersion, browserName } from 'react-device-detect'
import _ from 'lodash'
const monthMap = require('../json/monthNames.json')

export const responseParsers = {
  /**
   * 
   * @param {} eventType 
   * timeupdate, play, pause, seeking, seeked, changedspeed, fullscreenchange, 
   * filtertrans, edittrans, sharelink
   * selectcourse, userinactive, changevideo
   * @param {*} data 
   * { offeringId, mediaId, json }
   */
  sendUserAction: function(eventType, data = {}) {
    // console.log({eventType, ...data, userId: api.userId() })
    const { json, mediaId, offeringId } = data
    return httpPOST.postData('Logs', {
      eventType, 
      mediaId, 
      offeringId,
      userId: user.userId(),
      json: {
        ...json, 
        device: { deviceType, osVersion, osName, fullBrowserVersion, browserName }
      }
    })
  },


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

  // parseSingleOffering: function(rawOffering) {
  //   const { offering, courses, term } = rawOffering
  //     let { universityId } = term
  //     let departmentIds = _.map(courses, 'departmentId')
  //     parsedOfferings.push({
  //       ...offering,
  //       departmentIds,
  //       universityId,
  //       termName: term.name,
  //       fullNumber: this.getFullNumber(courses),
  //       isTestCourse: _.findIndex(courses, { courseNumber: '000' }) >= 0 && !user.isAdmin(),
  //     })
  // },
  
  parseOfferings: async function(rawOfferings) {
    const parsedOfferings = []
    for (let i = 0; i < rawOfferings.length; i++) {
      const { offering, courses, term } = rawOfferings[i]
      // let { courseName, description } = courses[0]
      let { universityId } = term
      let departmentIds = _.map(courses, 'departmentId')
      parsedOfferings.push({
        ...offering,
        // courseName, 
        // description, 
        departmentIds,
        universityId,
        termName: term.name,
        fullNumber: this.getFullNumber(courses),
        isTestCourse: _.findIndex(courses, { courseNumber: '000' }) >= 0 && !user.isAdmin(),
      })
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
  parseMedia: function(media) {
    let re = { 
      id: '', 
      mediaName: '', 
      createdAt: '', 
      sourceType: 1,
      isTwoScreen: false, 
      videos: [], 
      transcriptions: [],
      isUnavailable: false,
    }
    
    if (!media) return re
    const { id, playlistId, jsonMetadata, sourceType, video, transcriptions } = media
    if (!id || !jsonMetadata) return re
    re.id = id
    re.createdAt = jsonMetadata.createdAt
    re.playlistId = playlistId
    re.sourceType = sourceType


    if (sourceType === 1) { // youtube
      re.mediaName = jsonMetadata.title
    } else if (sourceType === 0) { // echo360
      let { lessonName, createdAt } = jsonMetadata
      let date = new Date(createdAt)
      re.mediaName = `${lessonName || ''}  ${monthMap[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    } else { // upload
      if (jsonMetadata.filename) re.mediaName = jsonMetadata.filename
      else {
        let fileData = JSON.parse(jsonMetadata.video1)
        re.mediaName = fileData.FileName
      }
    }


    if (!video || !(video.video1Path || (video.video1 && video.video1.path))) {
      re.isUnavailable = true
    } else {
      re.isTwoScreen = video.video2Path || (video.video2 && video.video2.path)
      var baseUrl = api.baseUrl()
      re.videos.push({
        srcPath1: `${baseUrl}${video.video1Path || video.video1.path}`,
        srcPath2: re.isTwoScreen ? `${baseUrl}${video.video2Path || video.video2.path}` : null
      })
    }


    transcriptions.forEach( trans => {
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
    console.log(JSON.stringify(error))
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