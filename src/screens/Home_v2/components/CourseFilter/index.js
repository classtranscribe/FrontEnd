import React from 'react';
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
    <CTFragment sticky offsetTop="50" className="ct-homep course-filter">
      <CTFormRow padding={[10, 10, 0, 15]} vEnd>
        <CTSelect
          placeholder="University"
          label="University"
          value={selUniversity}
          options={universityOptions}
          onChange={handleUniversityChange}
          // underlined
        />
        {
          selUniversity
          &&
          <CTSelect
            placeholder="Filter by departments"
            label="Filter by departments"
            value={selDepartments}
            options={departmentOptions}
            onChange={handleDepartmentsChange}
            underlined
            multiple
          />
        }

        {
          selUniversity
          &&
          <CTSelect
            placeholder="Filter by terms"
            label="Filter by terms"
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
