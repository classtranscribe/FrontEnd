import _ from 'lodash';
import React, { useState, useEffect } from 'react';
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

  let option = _.find(options, { value }) || {};

  const [inputVal, setInputVal] = useState(option.text);

  const handleChange = (event, newOption) => {
    if (typeof onChange === 'function' && newOption) {
      onChange(newOption.value);
    }
  };

  const handleInputChange = (event) => {
    setInputVal(event ? event.target.value : '');
  };

  useEffect(() => {
    setInputVal(option.text || '');
  }, [value]);

  const renderInput = (params) => (
    <Input {...params} {...inputProps} />
  );

  return (
    <MuiAutocomplete
      autoHighlight
      disableClearable
      value={value}
      inputValue={inputVal}
      options={options}
      onInputChange={handleInputChange}
      getOptionLabel={(opt) => opt.text}
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
