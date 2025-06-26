import { prompt as prp } from './prompt';

/**
 * Log error to the UI
 * @param {String} text
 * @param {Object} options
 * @param {String} options.position
 * @param {Number} options.timeout
 */
export function logErrorToPrompt(text, options) {
  const { position, timeout } = options;
  prp.addOne({ text, position, timeout });
}

/**
 * Log the error message to console
 * @param {Error|String} error the error message or error object
 */
export function logErrorToConsole(error) {
  let message = error;
  if (typeof error === 'object') {
    message = error.message;
  }

  console.error(message);
}

/**
 * Error logger
 * @param {Error|String} error the error message or error object
 * @param {Object} options the options of logger
 * @param {Boolean} options.toPrompt true if log to prompt
 * @param {Boolean} options.toConsole true if log to console
 * @param {Boolean} options.toAppInsights true if log to Azure Application Insights
 * @param {Number} options.promptText the text of the prompt
 * @param {String} options.promptPosition the position of the prompt (default 'bottom right')
 * @param {Number} options.promptTimeout the timeout (in `ms`) of the prompt (default -1)
 */
export function logError(error, options = {}) {
  const {
    toConsole = true,
    prompt = true,
    promptPosition = 'bottom right',
    promptTimeout = -1,
    promptText = '',
  } = options;

  const errorObj = typeof error === 'string' ? new Error(error) : error;

  if (prompt) {
    logErrorToPrompt(promptText || errorObj.message, {
      position: promptPosition,
      timeout: promptTimeout,
    });
  }

  if (toConsole) {
    logErrorToConsole(promptText || errorObj);
  }
}
