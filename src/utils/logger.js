import { getAppInsights, SeverityLevel } from 'azure-app-insights'
import { prompt as prp } from './prompt'

/**
 * Log error to the UI
 * @param {String} text
 * @param {Object} options
 * @param {String} options.position
 * @param {Number} options.timeout
 */
export function logErrorToPrompt(text, options) {
    let { position, timeout } = options
    prp.addOne({ text, position, timeout })
}

/**
 * Log the error to Azure Application Insights
 * @param {Error} error the error object
 */
export function logErrorToAzureAppInsights(error) {
    let appInsights = getAppInsights()
    if (appInsights && typeof appInsights.trackException === 'function') {
        appInsights.trackException({ error, severityLevel: SeverityLevel.Error })
    }
}

/**
 * Log the error message to console
 * @param {Error|String} error the error message or error object
 */
export function logErrorToConsole(error) {
    if (typeof error === 'object') error = error.message
    console.error(error)
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
export function logError(error, options={}) {
    let { 
        toAppInsights=true, toConsole=true,
        prompt=true, 
        promptPosition='bottom right', 
        promptTimeout=-1,
        promptText=''
    } = options

    error = typeof error === 'string' ? new Error(error) : error

    if (prompt) {
        logErrorToPrompt(
            promptText || error.message, 
            { 
                position: promptPosition, 
                timeout: promptTimeout 
            }
        )
    }

    if (toAppInsights) {
        logErrorToAzureAppInsights(error)
    }

    if (toConsole) {
        logErrorToConsole(promptText || error)
    }
}