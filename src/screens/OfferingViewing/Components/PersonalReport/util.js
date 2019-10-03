import _ from 'lodash'
import { api } from 'utils'

export function parseTimeUpdate(data, offerings) {
  var parsedData = []
  data.forEach(elem => {
    var offering = offerings.filter(offering => offering.id === elem.offeringId)[0] || {}
    
    var fullNumber = api.getFullNumber(offering.courses || [])
    var { termName, sectionName } = offering.offering || {}

    var count = 0
    elem.medias.forEach( media => {
      count += media.count
    })

    parsedData.push({
      offering: { fullNumber, termName, sectionName },
      offeringId: elem.offeringId,
      mins: Math.ceil(count / 4),
      editTransCount: 0,
      filterTransCount: 0,
    })
  })
  
  return parsedData
}

export function parseEditTrans(data, timeupdates) {
  data.forEach(elem => {
    var currIdx = _.findIndex(timeupdates, { offeringId: elem.offeringId })
    if (currIdx >= 0) {
      var count = 0
      elem.medias.forEach( media => {
        count += media.count
      })
      timeupdates[currIdx].editTransCount = count
    }
  })
  
  return timeupdates
}

export function parseFilterTrans(data, timeupdates) {
  data.forEach(elem => {
    var currIdx = _.findIndex(timeupdates, { offeringId: elem.offeringId })
    if (currIdx >= 0) {
      var count = 0
      elem.medias.forEach( media => {
        count += media.count
      })
      timeupdates[currIdx].filterTransCount = count
    }
  })
  
  return timeupdates
}