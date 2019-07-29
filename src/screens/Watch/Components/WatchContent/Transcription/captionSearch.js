import _ from 'lodash'

export const capSearch = {
  getResult: function(captions, value) {
    if (!value) return []
    const tests = []
    // get test functions for each word
    value.split(' ').forEach( word => {
      const re = new RegExp(_.escapeRegExp(word), 'i')
      const test = result => re.test(result.text)
      tests.push(test)
    })
    // combine the test result
    const isMatch = result => {
      var match = true
      tests.forEach( test => match = match && test(result))
      return match
    }

    const re = _.filter(captions, isMatch)
    return re.length ? re : ['NOT FOUND']
  },
  highlight: function(value) {
    
  }
}