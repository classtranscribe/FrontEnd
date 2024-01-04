/* eslint-disable no-console */
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
      currentUni: null,
      currentDept: null,

      universities: [],
      
      instructors: [], // for currentUni
      terms: [], // for current Uni
      departments: [], // for currentUni

      courses: [], // for currentDept
      // courseCurrDeparts: [],
      // courseCurrDepart: null,

      
    };
    this.getSelectOptions = _getSelectOptions;
    this.getAll = this.populateState.bind(this);
  }

  async populateState() {
    const universities = (await api.getUniversities()).data;
    
    let previousUniId =localStorage.getItem('adminCurrUni') || user.getUserInfo().universityId;
    
    const currentUni = previousUniId ? _.find(universities, { id: previousUniId }) : '' 
    this.setState({ universities, currentUni });

    if (currentUni) {
      this.populateTermsForUniversityIf(currentUni.id);
      this.populateDepartmentsForUniversityId(currentUni.id);
    }
    api.contentLoaded();
  }

  /**
   * Specific get-by-id functions
   */
  async populateTermsForUniversityIf(uniId) {
    let terms = null;
    try {
      terms = uniId? (await api.getTermsByUniId(uniId)).data : null
    } catch (err) {
      console.log(err);
    }
    this.setState({ terms });
  };
  async populateDepartmentsForUniversityId(uniId) {
    let departments = null;
    try {
      departments = uniId ? (await api.getDepartsByUniId(uniId)).data : null;
    } catch (err) {
      console.log(err);
    }

    this.setState({ departments });
  };

async populateCoursesForDepartmentId(departId) {
    let courses = [];
    try {
      courses = departId ? (await api.getCoursesByDepartId(departId)).data : [];
    } catch (err) {
      console.log(err);
    }
    this.setState({ courses });
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
    this.populateState();
  }

  /**
   * set current selected options and get corresponding data
   * @param name the state name to set
   * @param value the value to assign
   */
  updateUniversity = (id) => {
    // set **CurrUni store in localStorage, then get terms/departs cased on this uni id
      this.setState((prev)=> {return {
        currentUni : prev.universities.find(uni => uni.id === id),
        currentDept : null}} );
      localStorage.setItem('adminCurrUni', id);
      this.populateTermsForUniversityIf(id);
      this.populateDepartmentsForUniversityId(id, 'departments');
  }
  updateDepartment = (id) => {
      this.setState((prev) => {return {
        currentDept: prev.departments.find(d => d.id === id)
      }});
      this.populateCoursesForDepartmentId(id);
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
