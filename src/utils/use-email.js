import _ from 'lodash';

class EmailHandler {
  constructor() {
    this.isValid = this.isValid.bind(this);
    this.extract = this.extract.bind(this);
  }

  /** The regex for an email address */
  VALID_EMAIL_REGEX = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /**
   * Validate an email address
   * @param {String} email - the email to validate
   * @returns {Boolean} true if the email is valid
   */
  isValid(email) {
    return this.VALID_EMAIL_REGEX.test(email);
  }

  /**
   * Extract email format string from a paragraph of text
   * @param {String} text - a paragraph of text that contain multiple email addresses
   * @returns {String[]} a list of valid emails in the text
   */
  extract(text) {
    if (typeof text === 'string') {
      // split string by common delimiter
      const text_arr = text.split(/<|>|,|;|\t|\n|\r\n|\r|:|'+|"+| /);
      // filter out invalid email strings
      return _.filter(text_arr, this.isValid);
    }

    // return empty array if the text is not valid
    return [];
  }
}

export const uemail = new EmailHandler();