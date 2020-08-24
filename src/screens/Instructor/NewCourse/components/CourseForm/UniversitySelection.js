import React from 'react';
import PropTypes from 'prop-types';
import { 
  CTFragment, 
  CTFormHeading, 
  CTFormRow, 
  CTSelect,
  CTFormHelp
} from 'layout';
import { user, _getSelectOptions } from 'utils';

function UniversitySelection(props) {
  const {
    uniId,
    universities,
    handleUniChange
  } = props;

  const uniOptions = _getSelectOptions(universities, 'name');

  return user.isAdmin ? (
    <CTFragment>
      <CTFormHeading>University Selection</CTFormHeading>
      <CTFormHelp title="">
        As an admin you can create courses under different universities.
      </CTFormHelp>
      <CTFormRow>
        <CTSelect
          required
          label="Select an University"
          options={uniOptions}
          value={uniId}
          onChange={handleUniChange}
        />
      </CTFormRow>
    </CTFragment>
  ) : null;
}

UniversitySelection.propTypes = {
  uniId: PropTypes.string,
  universities: PropTypes.array,
  handleUniChange: PropTypes.func
};

export default UniversitySelection;

