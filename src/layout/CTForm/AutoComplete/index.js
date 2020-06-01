import React from 'react';
import PropTypes from 'prop-types';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { Input } from '../Input';

/**
 * A auto complete component based on material-ui's Autocomplete
 * @external {@link {https://material-ui.com/components/autocomplete/}}
 */
export function AutoComplete(props) {
  let {
    value,
    options = [],
    onChange,
    ...inputProps
  } = props;

  const renderInput = (params) => (
    <Input {...params} {...inputProps} />
  );

  const handleChange = (event, newOption) => {
    if (typeof onChange === 'function') {
      onChange(newOption.value);
    }
  };

  return (
    <MuiAutocomplete
      value={value}
      options={options}
      getOptionLabel={(option) => option.text}
      onChange={handleChange}
      renderInput={renderInput}
    />
  );
}

AutoComplete.propTypes = {
  /** Options of the selection */
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string, 
      PropTypes.number
    ]),
    text: PropTypes.string,
  })),

  ...Input.propTypes
};
