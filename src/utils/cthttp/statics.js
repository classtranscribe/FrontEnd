import { env } from '../env'

export const initialData = require('../json/initialData.json')
export const offeringAccessType = require('../json/offeringAccessTypes.json')
export const playlistTypes = require('../json/playlistTypes.json')

export const baseUrl = () => env.baseURL || window.location.origin

export const getMediaFullPath = path => baseUrl() + path

export const contentLoaded = interval => {
    const ele = document.getElementById('ct-loading-wrapper')
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