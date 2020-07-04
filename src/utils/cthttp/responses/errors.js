/**
 * Parse request response error
 * @param {Error} error error object
 * @returns {{status:number}}
 */
export function parseError(error) {
  // console.log(JSON.stringify(error))
  const { response } = error;
  if (!response) {
    // Server Error
    return { status: 500 };
  }
  return { status: response.status };
}

export function errorType(error) {
  return parseError(error).status;
}

export function isError(errorLike) {
  return typeof errorLike === 'number';
}

/**
 * Determine if the error type is an authorization error
 * @param {Error} error error object
 * @returns {Boolean} true if the error type is an authorization error; otherwise return false
 */
export function isAuthError(error) {
  const { status } = parseError(error);
  return status === 401 || status === 403;
}
