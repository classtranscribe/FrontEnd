import React from 'react'
import _ from 'lodash'
import authentication from 'react-azure-adb2c'

// UIs
import { Row, Col } from 'react-bootstrap'
import { ClassTranscribeHeader, FixedFooter } from '../../components'
import CourseList from './courses'
import Filter from './filter'
import SearchBar from './searchbar'
import './index.css'

// Vars
import { search, sortFunc, user, api } from '../../util';
import { fakeData } from '../../data';
const searchSource = search.getCourseSource();
const initialStates = {
  filterLoading: !true, // should be true at the beginning.
  coursesLoading: !true, // should be true at the beginning.

  darkMode: localStorage.getItem('darkMode') === 'dark' ? true : false,
  gridMode: localStorage.getItem('gridMode') === 'grid' ? true : false,
  searching: false,
  searchLoading: false,
  searchResults: [],
  searchInput: "",

  showUniFilter: localStorage.getItem('showUniFilter') === 'show' ? true : false,
  showTermFilter: localStorage.getItem('showTermFilter') === 'show' ? true : false,
  showDepartFilter: localStorage.getItem('showDepartFilter') === 'show' ? true : false,

  currTerm: 'All',
  currDepart: 'All',
  currUni: 'All',
};

export class StudentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialStates;

    this.user = {name: "StudentXXX"};

    this.terms = fakeData.terms;
    this.departments = fakeData.departments.slice().sort();
    this.courses = fakeData.courses.slice().sort(sortFunc.sortByCourseNum);
    this.universities = ['UIUC']; // University of Illinois at Urbana-Champaign
  }

  componentDidMount() {
    /**
     * Hide the loading page
     */
    api.contentLoaded()
  }

/* Mode setting functions: dark/light, grid/list */
  setDarkMode = () => {
    this.setState({darkMode: !this.state.darkMode})
    localStorage.setItem('darkMode', !this.state.darkMode ? 'dark' : 'light')
  }

  setGridMode = () => {
    this.setState({gridMode: !this.state.gridMode})
    localStorage.setItem('gridMode', !this.state.gridMode ? 'grid' : 'list')
  }

/* Functions for handling searching */
  onSearch = () => {
    this.setState({searching: !this.state.searching})
  }

  onResultSelect = (e, { result }) => {
    this.setState({ searchInput: result.title });
    alert(`Videos of ${result.num} at ${result.term}`)
    // window.location = result.link;
  }

  onSearchChange = (e, { value }) => {
    this.setState({ searchLoading: true, searchInput: value})

    setTimeout(() => {
      if (this.state.searchInput.length < 1) {
        return this.setState({
          searchLoading: false, 
          searchInput: '', 
          searchResults: []
        })
      }

      const re = new RegExp(_.escapeRegExp(this.state.searchInput), 'i')
      const isMatch = result => re.test(result.title)
      // console.log(_.filter(searchSource, isMatch));
      this.setState({
        searchLoading: false,
        searchResults: _.filter(searchSource, isMatch),
      })
    }, 300)
    // console.log(this.state.searchResults);
  }

/* Functions for handling filters */
  showFilter = filter => {
    this.setState({[filter]: !this.state[filter]})
    localStorage.setItem(filter, !this.state[filter] ? 'show' : 'hide')
  }

  setFilter = (currFilter, value) => {
    if (currFilter === 'reset') {
      localStorage.setItem('showDepartFilter', 'hide');
      localStorage.setItem('showTermFilter', 'hide');
      localStorage.setItem('showUniFilter', 'hide');
      return this.setState({
        currDepart: 'All', currTerm: 'All', currUni: 'All',
        showDepartFilter: false, showTermFilter: false, showUniFilter: false
      })
    }
    this.setState({[currFilter]: value});
    localStorage.setItem(currFilter, value);
  }

  onSignOut = () => { authentication.signOut() }

  render() {
    const darkMode = this.state.darkMode;
    const theme = darkMode ? '-dark' : '';
    
    const { searchLoading, searchInput, searchResults } = this.state;
    const { filterLoading, coursesLoading } = this.state;

    return (
      <div className={"sp-bg"+theme} ref={this.listen}>
        <ClassTranscribeHeader 
          darkMode={darkMode}
          user={{name: user.firstName()}}
          onSignOut={user.signout}
        />   
        <Col>
          <SearchBar 
            {...this}
            {...this.props}
            {...this.state}
            loading={searchLoading} 
            value={searchInput} 
            results={searchResults}
          />

          <Row className={"sp-content"+theme} noGutters>
            <Col md="auto" className="filter-container">
              <Filter
                {...this}
                {...this.state} 
                theme={theme}
                loading={filterLoading}
                onFilteringTerm={()=>this.showFilter('showTermFilter')}
                onFilteringDepart={()=>this.showFilter('showDepartFilter')} 
                onFilteringUni={()=>this.showFilter('showUniFilter')}
              />
            </Col>
            <Col md={{offset: 0}} className="course-list-container">
              <CourseList 
                {...this}
                {...this.state}
                theme={theme}
                loading={coursesLoading}
              />
            </Col>
          </Row>
          <FixedFooter darkMode={theme === '-dark'}/>
        </Col>
      </div>
    );
  }
}