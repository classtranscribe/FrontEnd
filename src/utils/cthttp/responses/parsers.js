/* eslint-disable no-console */
/* eslint-disable complexity */
import _ from 'lodash';
import sortBy from 'lodash/sortBy';
import { FLASH_UNKNOWN, CROWDEDIT_ALLOW } from 'utils/constants';
import { langMap } from '../../../screens/Watch/Utils';
import { user } from '../../user';
import { env } from '../../env';

/**
 * Generate full number based on the courses
 * @param {Object[]} courses
 * @param {String} courses[].departmentAcronym
 * @param {String} courses[].acronym
 * @param {String} courses[].courseNumber
 * @param {String} separator
 * @returns {String} full number based on the courses
 */
export function getFullNumber(courses, separator) {
  let name = '';
  courses.forEach((course) => {
    name +=
      (course.departmentAcronym || course.acronym || '') + course.courseNumber + (separator || '/');
  });
  name = name.slice(0, name.length - 1);
  return name;
}

/**
 * Function used to parse offering response
 * @param {Object} rawOffering the raw offering data
 * @returns {{
 *  id: string,
 *  fullNumber: string,
 *  courseName: string,
 *  description: string,
 *  accessType: number,
 *  sectionName: string,
 *  universityId: string,
 *  termId: string,
 *  termName: string,
 *  departmentIds: [string],
 *  isTestCourse: boolean,
 *  instructorIds: [{
 *      id: string,
 *      email: string,
 *      firstName: string,
 *      lastName: string
 *  }],
 *  instructor: {
 *      id: string,
 *      email: string,
 *      fullName: string,
 *      firstName: string,
 *      lastName: string
 *  },
 *  jsonMetadata?: object,
 * }} parsed offering data
 */
export function parseSingleOffering(rawOffering) {
  const { offering, courses, term, instructorIds } = rawOffering;
  const { universityId } = term;
  const departmentIds = _.map(courses, 'departmentId');
  return {
    ...offering,
    courses,
    departmentIds,
    universityId,
    instructorIds,
    termName: term.name,
    fullNumber: getFullNumber(courses),
    isTestCourse: _.findIndex(courses, { courseNumber: '000' }) >= 0 && !user.isAdmin,
    instructor: instructorIds
      ? {
          ...(instructorIds[0] ? instructorIds[0] : {}),
          fullName: instructorIds[0]
            ? `${instructorIds[0].firstName} ${instructorIds[0].lastName}`
            : '',
        }
      : null,
  };
}

/**
 * Function used to parse offerings response
 * @param {Object} rawOfferings
 * @returns {{
 *  id: string,
 *  fullNumber: string,
 *  courseName: string,
 *  description: string,
 *  accessType: number,
 *  sectionName: string,
 *  universityId: string,
 *  termId: string,
 *  termName: string,
 *  departmentIds: [string],
 *  isTestCourse: boolean,
 *  instructorIds: [{
 *      id: string,
 *      email: string,
 *      firstName: string,
 *      lastName: string
 *  }],
 *  instructor: {
 *      id: string,
 *      email: string,
 *      fullName: string,
 *      firstName: string,
 *      lastName: string
 *  },
 *  jsonMetadata?: object,
 * }[]} parsed offerings data
 */
export function parseOfferings(rawOfferings, filterTestCourses = false) {
  const parsedOfferings = [];
  for (let i = 0; i < rawOfferings.length; i += 1) {
    let parsedOffering = parseSingleOffering(rawOfferings[i]);
    if (!filterTestCourses || !parsedOffering.fullNumber.includes('CS000')) {
      parsedOfferings.push(parsedOffering);
    }
  }
  // console.log('parsedOfferings', parsedOfferings)
  return parsedOfferings;
}

/**
 * Function used to parse media response
 * @param {Object} media the raw media data
 * @returns {{
 *  id:string,
 *  createdAt: string,
 *  mediaName: string,
 *  sourceType: number,
 *  isTwoScreen: boolean,
 *  hasASL: boolean,
 *  videos: {srcPath1: string, srcPath2: string}[],
 *  transcriptions: {id: string, language: string, src: string}[],
 *  isUnavailable: boolean,
 *  transReady: boolean,
 *  sceneDetectReady: boolean,
 *  watchHistory: { timestamp: number, ratio: number }
 * }} the parsed media data
 */
export function parseMedia(media) {
  const re = {
    id: '',
    mediaName: '',
    createdAt: '',
    sourceType: 1,
    isTwoScreen: false,
    hasASL: false,
    videos: [],
    transcriptions: [],
    isUnavailable: true,
    transReady: false,
    sceneDetectReady: false,
    watchHistory: { timestamp: 0, ratio: 0 },
    duration: null,
    flashWarning: FLASH_UNKNOWN,
    crowdEditMode: CROWDEDIT_ALLOW
  };

  // console.log(media)

  if (!media) return re;
  const {
    id,
    playlistId,
    name,
    jsonMetadata,
    sourceType,
    video,
    transcriptions,
    ready,
    watchHistory,
    duration,
    sceneDetectReady,
    flashWarning,
    crowdEditMode
  } = media;

  if (!id || !jsonMetadata) return re;

  re.id = id;
  re.createdAt = media.createdAt;
  re.playlistId = playlistId;
  re.sourceType = sourceType;
  re.transReady = ready;
  re.sceneDetectReady = sceneDetectReady;
  re.mediaName = _.replace(name, '.mp4', '');
  re.duration = duration;
  re.flashWarning = flashWarning;
  re.crowdEditMode = crowdEditMode;

  /** video src */
  const baseUrl = env.baseURL;
  let srcPath1 = null;
  let srcPath2 = null;
  let aslPath = null;

  if (video) {
    // video1
    if (video.video1Path) srcPath1 = baseUrl + video.video1Path;
    else if (video.video1 && video.video1.path) srcPath1 = baseUrl + video.video1.path;
    // video2
    if (video.video2Path) srcPath2 = baseUrl + video.video2Path;
    else if (video.video2 && video.video2.path) srcPath2 = baseUrl + video.video2.path;

    if(video.aslPath) aslPath = baseUrl + video.aslPath;
    else if (video.aslVideo && video.aslVideo.path) aslPath = baseUrl + video.aslVideo.path;
  }
 
  re.isUnavailable = !srcPath1;
  re.isTwoScreen = Boolean(srcPath2);
  re.aslPath = aslPath;
  re.hasASL = Boolean(aslPath);
  re.videos.push({ srcPath1, srcPath2, aslPath });
  /** Transcriptions */
  const uniqLabels = {}
  _.forEach(transcriptions, (trans) => {
    if (trans.file || trans.path) {
      const publicLabel = langMap[trans.language] + (trans.transcriptionType >0 ? ' descriptions' : '');
      const count = uniqLabels[publicLabel] ?? 1;
      uniqLabels[publicLabel] = count + 1;
      
      re.transcriptions.push({
        id: trans.id,
        // Put English and Descriptions at top
        halfKey : `${trans.language.replace('en-us','@')}/${10-trans.transcriptionType}/${trans.sourceLabel}/${count}`,
        transcriptionType: trans.transcriptionType,
        label: trans.label,
        sourceLabel: trans.sourceLabel ,
        language: trans.language,
        publicLabel :  publicLabel + (count > 1 ? `-${count}` : ''),
        src: `${baseUrl}${trans.path || trans.file.path}`,
      });
  }
  // todo add more to the halfkey if these are not unique
  re.transcriptions = sortBy( re.transcriptions , (i) => i.halfKey );
  });

  /** Watch history */
  if (watchHistory && watchHistory.json && watchHistory.json.ratio) {
    re.watchHistory = watchHistory.json;
    // re.watchHistory.ratio *= 100
  }

  return re;
}
