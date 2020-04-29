import $ from 'jquery'
import { v4 as uuidv4 } from 'uuid'
import { links   } from './links'
import * as elem from './elements'
import * as loggerToExport from './logger'

export { env              } from './env'
export { api              } from './cthttp'
export { user             } from './user'
export { search           } from './search'
export { userAction       } from './useraction'
export { CTEpubGenerator  } from './epub-gen'
export { CTPrompt, prompt } from './prompt'
export { CTPreference     } from './user-preference'
export { html             } from './2html'

export * from './constants'
export const logger = loggerToExport


/**
 * Objects for switching pages and storing some general functions
 */
export const util = {
  elem: elem,
  links: links,

  genId(prefx='ct') {
      return `${prefx}-${uuidv4()}`;
  },

  refresh() {
    document.location.reload(true);
  },

  getSelectOptions(array=[], tag) {
    if (!Array.isArray(array)) return []
    var options = []
    array.forEach( item => {
      if (!item || !item.id) return
      var text = ''
      if ((tag === 'depart' || tag === 'term') && item.uniName) {
        text = `${item.name} (${item.uniName})`
      } else {
        text = item.name || tag + item.courseNumber
      }
      options.push({text: text, value: item.id})
    })
    return options
  },

  getFittedName(name, charNum) {
    if (!name) return ''

    let fittedName = name.slice(0, charNum)
    if (fittedName !== name) fittedName += '...'
    return fittedName
  },

  fixForAccessbitity(category) {
    switch (category) {
      case 'widgets/scripts':
        $('.default').each(
          (index, elem) => {
            elem.removeAttribute('aria-live')
            elem.removeAttribute('role')
          }
        )
        break;
      case 'formSearchDropdown':
        $('.search').each(
          (index, elem) => {
            if (elem.title) {
              // elem.setAttribute('aria-label', elem.title)
            } else {
              elem.setAttribute('aria-label', elem.parentElement.title)
            }
          }
        )
        break;
      default:
        break;
    }    
  },

  preventBreakLine(e={}) {
    if (e.keyCode === 13) e.preventDefault()
  },

  /**
   * Determine whether a imput email is valid
   */
  isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },
  isValidUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  },
}

