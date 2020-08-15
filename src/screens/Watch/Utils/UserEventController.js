import UserEventManager from 'entities/UserEvent';

class UserEventController extends UserEventManager {
  registerIds(mediaId, offeringId) {
    if (mediaId) this.mediaId = mediaId;
    if (offeringId) this.offeringId = offeringId;
  }

  registerLanguage(lang) {
    if (lang) this.lang = lang;
  }

  buildEventData = (data) => {
    if (this.mediaId) data.mediaId = this.mediaId;
    if (this.offeringId) data.offeringId = this.offeringId;
    if (this.lang) data.json.lang = this.lang;
    return { ...data };
  }
}

export const uEvent = new UserEventController();