/**
 * FrontEnd Issue #62: Extract email format string from a paragraph of text
 * @param {String} text - a paragraph of text that contain multiple email addresses
 * @returns {Array}
 */

function emailHandler(text) {
    if (text != undefined) {
        // split string by common delimiter
        const text_arr = text.split(/<|>|,|;|\t|\n|:|'+|"+| /);
        // vaild email array
        let res_arr = new Array();
        for (let i = 0; i < text_arr.length; i++) {
          // check if there is one and only one '@'
          if(text_arr[i].match(/@/g || []) != null &&
              (text_arr[i].match(/@/g || [])).length == 1) {
            // check if both the first and the last char is not '@'
            if (text_arr[i][0] != '@' && 
                text_arr[i][text_arr[i].length-1] != '@') {
              
              res_arr.push(text_arr[i]);
            
            }
          }
          //console.log((res_arr[i].match(/@/)).length)
        }
        // return message if no vaild email addresses found
        if (res_arr.length == 0) {
          return "No valid email addresses."
        }
        return res_arr;
    }
    // return message if text is not defined
    return 'Error';
}