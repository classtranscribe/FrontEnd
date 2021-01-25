import React from 'react';
import { connect } from 'dva'
import cx from 'classnames';
import { isMobile } from 'react-device-detect';
import { CTFragment, CTSelect, CTFormRow } from 'layout';
import './index.scss';

function CourseFilter(props) {
  const {
    universities,
    departments,
    terms,
    selUniversity,
    selDepartments,
    selTerms,
    dispatch
  } = props;
  const universityOptions = universities.map(uni => ({ value: uni.id, text: uni.name }));
  const departmentOptions = departments.map(dep => ({ value: dep.id, text: dep.name }));
  const termOptions = terms.map(term => ({ value: term.id, text: term.name }));

  const showDepartments = selUniversity && !isMobile && departmentOptions.length > 0;
  const showTerms = selUniversity && !isMobile && termOptions.length > 0;

  const handleUniversityChange = ({ target: { value }}) => {
    dispatch({type: 'home/selectUniversity', payload: value})
  };

  const handleDepartmentsChange = ({ target: { value }}) => {
    dispatch({type: 'home/selectDepartments', payload: value})
  };

  const handleTermsChange = ({ target: { value }}) => {
    dispatch({type: 'home/selectTerms', payload: value})
  };
  return (
    <CTFragment sticky={!isMobile} offsetTop="50" className="ct-homep course-filter">
      <CTFormRow padding={[10, 0, 0, 10]} alignItEnd gridClassName="course-filter-item">
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
          showDepartments
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
          showTerms
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
export default connect(({home}) => {
  return {
    ...home
  }
})(CourseFilter);
