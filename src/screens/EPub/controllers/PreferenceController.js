import { CTPreferenceV2 } from 'utils/user-preference';

class PreferenceController extends CTPreferenceV2 {
  UserOnboardKey = 'epb-onboard';

  get isUserOnboard() {
    return this.isTrue(this.UserOnboardKey);
  }

  userOnboard = () => {
    this.setTrue(this.UserOnboardKey)
  }
}

export default PreferenceController;
export const epubPref = new PreferenceController();