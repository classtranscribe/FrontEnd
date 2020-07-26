import moment from 'moment';

class TimeString {
  /**
   * Convert seconds to a readable time string `H:mm:ss`
   * @param {Number} sec - seconds
   * @returns {String} H:mm:ss
   */
  static toTimeString(sec) {
    if (typeof sec !== 'number') return '';
    const formatter = sec < 3600 ? 'mm:ss' : 'H:mm:ss';
    return moment()
            .startOf('day')
            .seconds(sec)
            .format(formatter);
  }

  /**
   * Convert seconds to a readable time string with decimal fraction `H:mm:ss.xx`
   * @param {Number} sec - seconds
   * @returns {String} H:mm:ss.xx
   */
  static toDecimalTimeString(sec) {
    const formatter = 'HH:mm:ss';

    let fraction = parseFloat(sec % 1)
                    .toPrecision(2)
                    .substring(1, 3);

    return moment()
            .startOf('day')
            .seconds(sec)
            .format(formatter) + fraction;
  }

  /**
   * Convert time string H:mm:ss to seconds
   * @param {String} str - time string H:mm:ss
   * @returns {Number} seconds
   */
  static toSeconds(str) {
    if (typeof str !== 'string') return '';
    const strs = str.split(':');
    let seconds = 0;
    strs.forEach((timeStr, index) => {
      seconds += parseFloat(timeStr) * (60 ** (strs.length - index - 1));
    });

    return seconds;
  }

  static toPrettierTimeString(str) {
    if (typeof str !== 'string') return '';
    let timestr = str.slice(0, 8);
    if (timestr.startsWith('00:')) {
      return timestr.slice(3);
    }

    return timestr;
  }
}

export default TimeString;