import _ from 'lodash';

export function updateJson(old, changed) {
  old = _.clone(old);
  const res = {};
  Object.keys(old).forEach((key) => {
    res[key] = old[key] || changed[key];
  });

  return res;
}

export function momentToISOString(moment) {
  if (typeof moment === 'string') return moment;
  const date = moment.toDate();
  date.setUTCHours(0, 0, 0);
  return date.toISOString();
}
