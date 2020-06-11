import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { Input } from '../Input';

const getOption = (options, value) => _.find(options, { value });

/**
 * A auto complete component based on material-ui's Autocomplete
 * @external {@link {https://material-ui.com/components/autocomplete/}}
 */
export function AutoComplete(props) {
  let {
    value,
    defaultValue,
    options = [],
    onChange,
    label,
    ...inputProps
  } = props;

  const [option, setOption] = useState(getOption(options, value || defaultValue));

  const renderInput = (params) => (
    <Input {...params} {...inputProps} label={label} />
  );

  const handleChange = (event, newOption) => {
    if (typeof onChange === 'function' && newOption) {
      onChange(newOption.value);
      setOption(getOption(options, newOption.value));
    }
  };

  useEffect(() => {
    let opt = getOption(options, value);
    if (opt.value !== option.value) {
      setOption(opt);
    }
  }, [value])

  return (
    <MuiAutocomplete
      autoHighlight
      clearOnBlur={false}
      options={options}
      value={option}
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
