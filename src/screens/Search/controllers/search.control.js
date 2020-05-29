import { ARRAY_INIT } from 'utils/constants';
import { CTSearch } from 'utils/search';
import { setup } from './setup';

class SearchController extends CTSearch {
  constructor() {
    super();

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }
  
  handleSearchInputChange({ target: { value } }) {
    setup.setSearchValue(value);
  }

  resultResult() {
    setup.setSearchResult({});
  }

  searchFor(value) {
    if (!value) {
      this.resultResult();
      return;
    }

    const offerings = setup.offerings;
    if (offerings === ARRAY_INIT) return;

    let courseResult = this.getResults(offerings, value, [
      'termName',
      'fullNumber',
      'courseName',
      'sectionName',
    ]);

    setup.setSearchResult({ courseResult });
  }
}

export const searchControl = new SearchController();