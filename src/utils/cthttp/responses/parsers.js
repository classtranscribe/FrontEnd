import _ from 'lodash';
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
    videos: [],
    transcriptions: [],
    isUnavailable: true,
    transReady: false,
    sceneDetectReady: false,
    watchHistory: { timestamp: 0, ratio: 0 },
    duration: null,
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

  /** video src */
  const baseUrl = env.baseURL;
  let srcPath1 = null;
  let srcPath2 = null;
  if (video) {
    // video1
    if (video.video1Path) srcPath1 = baseUrl + video.video1Path;
    else if (video.video1 && video.video1.path) srcPath1 = baseUrl + video.video1.path;
    // video2
    if (video.video2Path) srcPath2 = baseUrl + video.video2Path;
    else if (video.video2 && video.video2.path) srcPath2 = baseUrl + video.video2.path;
  }

  re.isUnavailable = !srcPath1;
  re.isTwoScreen = Boolean(srcPath2);
  re.videos.push({ srcPath1, srcPath2 });

  /** Transcriptions */
  _.forEach(transcriptions, (trans) => {
    if (trans.file || trans.path) {
      re.transcriptions.push({
        id: trans.id,
        language: trans.language,
        src: `${baseUrl}${trans.path || trans.file.path}`,
      });
    }
  });

  /** Watch history */
  if (watchHistory && watchHistory.json && watchHistory.json.ratio) {
    re.watchHistory = watchHistory.json;
    // re.watchHistory.ratio *= 100
  }

  return re;
}
