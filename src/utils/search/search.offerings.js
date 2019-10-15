import _ from 'lodash'

export function searchInOfferings(offerings, value) {
  if (!value) return []
    const tests = []
    // get test functions for each word
    value.split(' ').forEach( word => {
      const re = new RegExp(_.escapeRegExp(word), 'i')
      const test = result => re.test(result.fullNumber) || re.test(result.termName) || re.test(result.courseName)
      tests.push(test)
    })
    // combine the test result
    const isMatch = result => {
      var match = true
      tests.forEach( test => match = match && test(result))
      return match
    }

    return _.filter(offerings, isMatch)
}