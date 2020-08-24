import React from 'react';
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { CTFragment, CTSelect, CTFormRow } from 'layout';
import { connectWithRedux, home } from '../../controllers';
import './index.scss';

function CourseFilter({
  universities,
  departments,
  terms,
  selUniversity,
  selDepartments,
  selTerms
}) {
  const universityOptions = universities.map(uni => ({ value: uni.id, text: uni.name }));
  const departmentOptions = departments.map(dep => ({ value: dep.id, text: dep.name }));
  const termOptions = terms.map(term => ({ value: term.id, text: term.name }));

  const handleUniversityChange = ({ target: { value }}) => {
    home.ctrl.selectUniversity(value);
  };

  const handleDepartmentsChange = ({ target: { value }}) => {
    home.ctrl.selectDepartments(value);
  };

  const handleTermsChange = ({ target: { value }}) => {
    home.ctrl.selectTerms(value);
  };

  return (
    <CTFragment sticky={!isMobile} offsetTop="50" className="ct-homep course-filter">
      <CTFormRow padding={[10, 0, 0, 10]} vEnd gridClassName="course-filter-item">
        <CTSelect
          id="home-uni-filter"
          placeholder="University"
          label="University"
          noItemsHolder="No universities"
          value={selUniversity}
          options={universityOptions}
          onChange={handleUniversityChange}
          className={cx({ 'selected': Boolean(selUniversity) })}
        />
        {
          (selUniversity && !isMobile)
          &&
          <CTSelect
            id="home-departs-filter"
            placeholder="Filter by departments"
            label="Filter by departments"
            noItemsHolder="No departments"
            value={selDepartments}
            options={departmentOptions}
            onChange={handleDepartmentsChange}
            underlined
            multiple
          />
        }

        {
          (selUniversity && !isMobile)
          &&
          <CTSelect
            id="home-terms-filter"
            placeholder="Filter by terms"
            label="Filter by terms"
            noItemsHolder="No terms"
            value={selTerms}
            options={termOptions}
            onChange={handleTermsChange}
            multiple
            underlined
          />
        }
      </CTFormRow>
    </CTFragment>
  );
}

export default connectWithRedux(
  CourseFilter,
  [
    'departments', 
    'terms', 
    'universities',
    'selUniversity',
    'selDepartments',
    'selTerms'
  ]
);
