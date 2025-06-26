/* eslint-disable no-console */
/**
 * Admin Page
 * - where admins can create and make changes on
 *   universities, departments, terms, and courses
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import _ from 'lodash';
import './index.css';
import { CTLayout } from 'layout';
import { api, user, links, _getSelectOptions } from 'utils';

export const AdminContext = createContext(null);

export function Admin() {
  const navigate = useNavigate();

  // State
  const [universities, setUniversities] = useState([]);
  const [currentUni, setCurrentUni] = useState(null);
  const [terms, setTerms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentDept, setCurrentDept] = useState(null);
  const [courses, setCourses] = useState([]);

  const getSelectOptions = _getSelectOptions;

  // Set page title on mount
  useEffect(() => {
    links.title('Admin');
  }, []);

  const populateTermsForUniversityIf = useCallback(async (uniId) => {
    try {
      const termsData = uniId ? (await api.getTermsByUniId(uniId)).data : null;
      setTerms(termsData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const populateDepartmentsForUniversityId = useCallback(async (uniId) => {
    try {
      const departmentsData = uniId ? (await api.getDepartsByUniId(uniId)).data : null;
      setDepartments(departmentsData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const populateState = useCallback(async () => {
    try {
      const universitiesData = (await api.getUniversities()).data;
      setUniversities(universitiesData);

      let previousUniId = localStorage.getItem('adminCurrUni') || user.getUserInfo().universityId;
      const foundUni = previousUniId ? _.find(universitiesData, { id: previousUniId }) : null;

      setCurrentUni(foundUni);

      if (foundUni) {
        populateTermsForUniversityIf(foundUni.id);
        populateDepartmentsForUniversityId(foundUni.id);
      }

      api.contentLoaded();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const populateCoursesForDepartmentId = useCallback(async (departId) => {
    try {
      const coursesData = departId ? (await api.getCoursesByDepartId(departId)).data : [];
      setCourses(coursesData);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (!user.isLoggedIn) {
      user.signIn();
    } else if (!user.isAdmin) {
      window.location = links.notfound404();
    } else {
      populateState();
    }
  }, [populateState]);

  // Handlers
  const updateUniversity = (id) => {
    const selectedUni = universities.find((uni) => uni.id === id);
    setCurrentUni(selectedUni);
    setCurrentDept(null);
    localStorage.setItem('adminCurrUni', id);
    populateTermsForUniversityIf(id);
    populateDepartmentsForUniversityId(id);
  };

  const updateDepartment = (id) => {
    const selectedDept = departments.find((d) => d.id === id);
    setCurrentDept(selectedDept);
    populateCoursesForDepartmentId(id);
  };

  const onSignOut = () => {
    user.signOut();
    navigate(-1); // history.back()
  };

  const getLayoutProps = () =>
    CTLayout.createProps({
      responsive: true,
      transition: true,
      footer: true,
      defaultOpenSidebar: true,
      headerProps: {
        subtitle: 'Admin',
      },
    });

  const contextValue = {
    currentUni,
    currentDept,
    universities,
    terms,
    departments,
    courses,
    getSelectOptions,
    updateUniversity,
    updateDepartment
  };
  return (
    <AdminContext.Provider value={contextValue}>
      <CTLayout {...getLayoutProps()}>
        <div className="admin-bg">
          <Outlet />
        </div>
      </CTLayout>
    </AdminContext.Provider>
  );
}