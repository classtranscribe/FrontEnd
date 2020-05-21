import _ from 'lodash';
// import { api } from '../../../../utils'

export function parseTimeUpdate(data, offerings) {
  const parsedData = [];
  data.forEach((elem) => {
    const offering = offerings.filter((off) => off.id === elem.offeringId)[0] || {};

    // var fullNumber = api.getFullNumber(offering.courses || [])
    const { termName, sectionName, fullNumber } = offering || {};

    let count = 0;
    elem.medias.forEach((media) => {
      count += media.count;
    });

    parsedData.push({
      offering: { fullNumber, termName, sectionName },
      offeringId: elem.offeringId,
      mins: Math.ceil(count / 4),
      editTransCount: 0,
      filterTransCount: 0,
    });
  });

  return parsedData;
}

export function parseEditTrans(data, timeupdates) {
  data.forEach((elem) => {
    const currIdx = _.findIndex(timeupdates, { offeringId: elem.offeringId });
    if (currIdx >= 0) {
      let count = 0;
      elem.medias.forEach((media) => {
        count += media.count;
      });
      timeupdates[currIdx].editTransCount = count;
    }
  });

  return timeupdates;
}

export function parseFilterTrans(data, timeupdates) {
  data.forEach((elem) => {
    const currIdx = _.findIndex(timeupdates, { offeringId: elem.offeringId });
    if (currIdx >= 0) {
      let count = 0;
      elem.medias.forEach((media) => {
        count += media.count;
      });
      timeupdates[currIdx].filterTransCount = count;
    }
  });

  return timeupdates;
}
