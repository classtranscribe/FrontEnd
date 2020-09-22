import { api, prompt, ARRAY_INIT, } from 'utils';
import { StateController } from 'utils/state-controller';

class SetupHistoryPage extends StateController {
  init(props) {
    let { setWatchHistories } = props;
    this.register({ setWatchHistories });
  }

  watchHistories = ARRAY_INIT;
  setWatchHistories(watchHistories) {
    this.setState('setWatchHistories', 'watchHistories', watchHistories);
  }

  async setupWatchHistories() {
    try {
      let { data } = await api.getUserWatchHistories();
      this.setWatchHistories(data.filter(media => media && media.id));
    } catch (error) {
      prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
    }
  }

  async setupHisoryPage() {
    // get watch history
    await this.setupWatchHistories();

    api.contentLoaded();
  }
}

export const setup = new SetupHistoryPage();