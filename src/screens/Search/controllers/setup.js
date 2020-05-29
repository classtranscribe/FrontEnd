import { api, ARRAY_INIT } from 'utils';
import { StateController } from 'utils/state-controller'

class SetupSearchPage extends StateController {
  init(props) {
    const {
      setOfferings,
      setSearchValue, setSearchResult
    } = props;

    this.register({
      setOfferings,
      setSearchValue, setSearchResult
    });
  }

  offerings = ARRAY_INIT
  setOfferings(offerings) {
    this.setState('setOfferings', 'offerings', offerings);
  }

  searchValue = ''
  setSearchValue(searchValue) {
    this.setState('setSearchValue', 'searchValue', searchValue);
  }

  searchResult = {}
  setSearchResult(searchResult) {
    this.setState('setOfferings', 'setSearchResult', searchResult);
  }

  async setupSearchPage() {
    let { data } = await api.getOfferingsByStudent();
    let offerings = api.parseOfferings(data);
    this.setOfferings(offerings);

    api.contentLoaded();
  }
}

export const setup = new SetupSearchPage();