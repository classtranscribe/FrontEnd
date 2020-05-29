import _ from 'lodash';
import { api, ARRAY_INIT } from 'utils';
import { links } from 'utils/links';
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

    this.parseSearchValue();
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
    this.setState('setSearchResult', 'searchResult', searchResult);
  }

  async setupSearchPage() {
    let { data } = await api.getOfferingsByStudent();
    let offerings = api.parseOfferings(data);
    this.setOfferings(offerings);

    api.contentLoaded();
  }

  parseSearchValue() {
    let { q } = links.useSearch();
    if (q) {
      let value = _.replace(q, /\+/i, ' ');
      this.setSearchValue(value);
    }
  }
}

export const setup = new SetupSearchPage();