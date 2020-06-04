import _ from 'lodash';
import { StateController } from 'utils/state-controller';
import { api, user, ARRAY_INIT, NOT_FOUND_404, } from 'utils';

class SetupNewCoursesPage extends StateController {
  async setupNewCoursesPage() {
    api.contentLoaded();
  }
}

export const setup = new SetupNewCoursesPage();