import { getShareableVideoURL } from 'screens/Watch/Utils';
import TimeString from 'utils/use-time';

class EPubImageData {
  constructor(imageLike = {}) {
    this.src = typeof imageLike === 'string' ? imageLike : imageLike.src || '';
    this.alt = imageLike.alt || 'Video screenshot';
    this.descriptions = Array.isArray(imageLike.descriptions) ? [...imageLike.descriptions] : [''];
    this.timestamp = imageLike.timestamp || '';
    this.link = imageLike.link && typeof imageLike.link === 'string' ? imageLike.link : '';
  }

  toObject() {
    return { src: this.src, alt: this.alt, descriptions: this.descriptions, timestamp: this.timestamp, link: this.link };
  }

  static create(raw) {
    return { src: raw.image, alt: raw.title, descriptions: raw.ocrElements, timestamp: raw.start }
  }

  static createWithTimestamp(raw, sourceId) {
    return { ...EPubImageData.create(raw), link: getShareableVideoURL(sourceId, TimeString.toSeconds(raw.start)) }
  }
}

export default EPubImageData;