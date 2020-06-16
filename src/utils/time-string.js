import moment from 'moment';

class TimeString {
  /**
   * Convert seconds to a readable time string `H:mm:ss`
   * @param {Number} sec - seconds
   * @returns {String} H:mm:ss
   */
  static toTimeString(sec) {
    const formatter = sec < 3600 ? 'mm:ss' : 'H:mm:ss';
    return moment()
            .startOf('day')
            .seconds(sec)
            .format(formatter);
  }

  /**
   * Convert time string H:mm:ss to seconds
   * @param {String} str - time string H:mm:ss
   * @returns {Number} seconds
   */
  static toSeconds(str) {
    if (typeof str !== 'string') return '';
    const strs = str.split(':');
    const len3 = strs.length > 2;
    const sec = (len3 ? parseFloat(strs[2]) : parseFloat(strs[1])) || 0;
    const min = (len3 ? parseFloat(strs[1]) : parseFloat(strs[0])) * 60 || 0;
    const hr = (len3 ? parseFloat(strs[0]) : 0) * 3600 || 0;
    return sec + min + hr;
  }
}

export default TimeString;