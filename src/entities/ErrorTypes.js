class ErrorTypes {
  static NotFound404 = {
    code: 404,
    header: 'The page cannot be found',
    description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
  };

  static Unauthorized401 = {
    code: 401,
    header: 'Unauthorized Access',
    description: 'Sorry, you are not authorized for your requested page or resource.',
  };

  static isError(error) {
    return [
      ErrorTypes.NotFound404, 
      ErrorTypes.Unauthorized401
    ].includes(error);
  };

  static parseError(error) {
    // console.log(JSON.stringify(error))
    const { response } = error;
    if (!response) {
      // Server Error
      return { status: 500 };
    }
    return { ...response };
  }

  static getError(error) {
    const { status } = ErrorTypes.parseError(error);
    switch (status) {
      case 404:
        return ErrorTypes.NotFound404
      case 401:
        return ErrorTypes.Unauthorized401
      default:
        return ErrorTypes.NotFound404
    }
  }
}

export default ErrorTypes;