import {
  deviceType,
  osVersion,
  osName,
  fullBrowserVersion,
  browserName,
} from 'react-device-detect';
import { api, user } from 'utils';

class UserEvent {
  constructor(eventType, data) {
    this.type = eventType;

    const { mediaId, offeringId, json } = data;
    this.event = {
      eventType,
      userId: user.userId,
      json: {
        ...json,
        device: {
          deviceType, 
          osVersion, 
          osName, 
          fullBrowserVersion, 
          browserName
        }
      }
    };

    if (offeringId) {
      this.event.offeringId = offeringId;
    }

    if (mediaId) {
      this.event.mediaId = mediaId;
    }

    this.send = this.send.bind(this);
  }

  send() {
    // console.log(this.event);
    return api.sendUserAction(this.event);
  }
}

export default UserEvent;