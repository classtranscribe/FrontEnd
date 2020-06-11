import { StateController } from "utils/state-controller";
import { api } from 'utils';

class SetupExamplePage extends StateController {
  init(props) {
    const { setOfferings } = props;

    this.register({ setOfferings });
  }

  offerings = []
  setOfferings(offerings) {
    this.setState('setOfferings', 'offerings', offerings);
  }

  async setupExamplePage() {
    let { data } = await api.getOfferingsByStudent();
    this.setOfferings(data);
    api.contentLoaded();
  }
}

export const setup = new SetupExamplePage();