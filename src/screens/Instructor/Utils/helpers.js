import _ from 'lodash'
import { api } from 'utils'

export function getFullNumber(offs) {
  let fullNumber = ''
  _.forEach( offs, (off, index) => {
    let { courseNumber } = off
    let { acronym } = off.depart
    if (index > 0) fullNumber += '/'
    fullNumber += acronym + courseNumber
  })

  return fullNumber
}

export function parseCourseOfferings(courseOfferings, departs, terms) {
  let offerArray = _.map( 
    courseOfferings, 
    co => {
      let { courseNumber, departmentId } = co.course
      let depart = _.find( departs, { id: departmentId } )

      let offerings = _.map( 
        co.offerings, 
        off => {
          let term = _.find( terms, { id: off.termId })
          return { ...off, term, depart, courseNumber }
      })

      return offerings
  })

  let offerIds = _.groupBy(_.flatten(offerArray), 'id')
  let offerings = _.map( offerIds, offs => {
    let off = offs[0]
    let fullNumber = getFullNumber(offs)
    off.courseNumber = fullNumber
    return off
  })

  console.log('offerings', offerings)
  return offerings
}


export async function setUpPlaylists(offeringId, setPlaylists) {
  try {
    let { data } = await api.getPlaylistsByOfferingId(offeringId)
    console.log('playlists', data)
    setPlaylists(data)
  } catch (error) {
    
  }
}