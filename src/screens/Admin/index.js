/**
 * Admin Page
 * - where admins can create and make changes on
 *   universities, departments, terms, and courses
 */

import React from 'react';
import _ from 'lodash';
import { Route, Redirect } from 'dva/router';
// UI
import './index.css';
// Layouts
import { CTLayout } from 'layout';
// Vars
import { api, user, links, _getSelectOptions } from 'utils';
import { tabs } from './tabs';

export class Admin extends React.Component {
  constructor(props) {
    super(props);
    links.title('Admin');
    this.state = {
      loading: true,

      universities: [],

      terms: [],
      termCurrUni: null,

      departments: [],
      departCurrUni: null,

      courses: [],
      courseCurrUni: null,
      courseCurrDeparts: [],
      courseCurrDepart: null,

      instructors: [],
    };
    this.getSelectOptions = _getSelectOptions;
    this.getAll = this.getAll.bind(this);
  }

  /**
   * Function for GET values after every page refreshing
   */
  getAll() {
    // TODO: connect to universities model
    api.getUniversities().then(({ data }) => {
      this.setState({ universities: data });
      /**
       * Hide the loading page
       */
      api.contentLoaded();
    });
    // loading data based on existing current values
    const { courseCurrDepart, courseCurrUni, termCurrUni } = this.state;
    if (termCurrUni) this.getTermsByUniId(termCurrUni.id);
    if (courseCurrUni) this.getDepartsByUniId(courseCurrUni.id, 'courseCurrDeparts');
    if (courseCurrDepart) this.getCoursesByDepartId(courseCurrDepart.id);
  }

  /**
   * Specific get-by-id functions
   */
  getTermsByUniId = (uniId) => {
    api
      .getTermsByUniId(uniId)
      .then((response_) => {
        this.setState({ terms: response_.data });
      })
      .catch((error) => console.error(error));
  };
  getDepartsByUniId = (uniId, name) => {
    api.getDepartsByUniId(uniId).then((response_) => {
      this.setState({ [name]: response_.data });
    });
  };
  getCoursesByDepartId = (departId) => {
    api.getCoursesByDepartId(departId).then((response_) => {
      this.setState({ courses: response_.data });
    });
  };

  /**
   * GET all info needed based on an admin
   */
  componentDidMount() {
    /**
     * 1. get userId and authToken
     */
    if (!user.isLoggedIn) {
      user.signIn();
    } else if (!user.isAdmin) window.location = links.notfound404();
    /**
     * 2. first load of values
     */
    this.getAll();
  }

  /**
   * set current selected options and get corresponding data
   * @param name the state name to set
   * @param value the value to assign
   */
  setCurrent = (name, { value }) => {
    // set **CurrUni store in localStorage, then get terms/departs cased on this uni id
    if (name.includes('Uni')) {
      this.setState((prevState) => ({ [name]: _.find(prevState.universities, { id: value }) }));
      if (name.includes('term')) {
        // termCurrUni
        this.getTermsByUniId(value);
      } else if (name.includes('depart')) {
        // departCurrUni
        this.getDepartsByUniId(value, 'departments');
      } else if (name.includes('course')) {
        // courseCurrUni
        // reset the 'courseCurrDepart' after change the 'courseCurrUni'
        this.setState({ courseCurrDepart: null, courses: [] });
        this.getDepartsByUniId(value, 'courseCurrDeparts');
      }
    } else if (name.includes('Depart')) {
      // set courseCurrDepart, then get its courses
      this.setState((prevState) => ({
        [name]: _.find(prevState.courseCurrDeparts, { id: value }),
      }));
      this.getCoursesByDepartId(value);
    }
  };

  onSignOut = () => {
    user.signOut();
    this.props.history.back();
  };

  getLayoutProps() {
    return CTLayout.createProps({
      responsive: true,
      transition: true,
      footer: true,
      defaultOpenSidebar: true,
      headerProps: {
        subtitle: 'Admin',
      }
    });
  }

  render() {
    // Tab panes of the contents
    const routes = tabs.map(tab => {
      let RouteElem = tab.component;
      return {
        ...tab,
        render: () => <RouteElem {...this} />
      };
    });

    return (
      <CTLayout {...this.getLayoutProps()}>
        <div className="admin-bg">
          <Route exact path={links.admin()} render={() => <Redirect to={routes[0].href} />} />

          {routes.map( route => (
            <Route
              key={route.value} 
              path={route.href} 
              render={route.render}
            />
          ))}
        </div>
      </CTLayout>
    );
  }
}
