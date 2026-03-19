import { env } from '../env'
import initialData from '../json/initialData.json'
import offeringAccessType from '../json/offeringAccessTypes.json'
import playlistTypes from '../json/playlistTypes.json'

export { initialData, offeringAccessType, playlistTypes }

/**
 * HTTP request's base url for this web
 * @returns {string} base url for this web
 */
export const baseUrl = () => env.baseURL || window.location.origin

/**
 * get full URL of a media path
 * @param {string} path the path to media
 * @returns {string} full URL of a media path
 */
export const getMediaFullPath = path => baseUrl() + path

/**
 * Stop the loading page wrapper
 * @param {number} interval remove the loading page wrapper after <interval> ms
 */
export const contentLoaded = interval => {
    const ele = document.getElementById('ct-page-wrapper')
    if(ele) {
        // fade out
        ele.classList.add('available')
        setTimeout(() => {
            // remove from DOM
            if (ele.parentNode) ele.outerHTML = ''
            // ele.classList.add('hide')
        }, interval || 500)
    }
}