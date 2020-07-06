import _ from 'lodash';
import { EPubData } from './EPubData';

export class EPubController {
  constructor() {
    this.data = null;  
  }

  initEPubData(ePubLike, media) {
    this.data = new EPubData(ePubLike);

    // the ePub data doesn't contain the `title`
    if (!this.data.title) {
      this.data.title = media.mediaName;
    }

    // the ePub data doesn't contain the `filename`
    if (!this.data.filename) {
      this.data.filename = media.mediaName;
    }
  }
}