import _ from 'lodash'
export function updateJson(old, changed) {
  old = _.clone(old);
  var res = {};
  for (var key in old) {
    res[key] = old[key] || changed[key];
  }
  return res;
}

export function momentToISOString(moment) {
  if (typeof moment === 'string') return moment
  const date = moment.toDate()
  date.setUTCHours(0, 0, 0)
  return date.toISOString()
}