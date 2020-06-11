import React from 'react';
import PropTypes from 'prop-types';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MaterialCheckbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';


export function Checkbox(props) {
  let {
    id,
    legend,
    label,
    helpText,
    checked,
    error = false,
    disabled = false,
    onChange,
  } = props;

  const checkboxElement = (
    <MaterialCheckbox id={id} disabled={disabled} checked={checked} onChange={onChange} />
  );

  return (
    <FormControl required error={error} component="fieldset">
      {Boolean(legend) && <FormLabel component="legend">{legend}</FormLabel>}

      <FormControlLabel
        control={checkboxElement}
        label={label}
        htmlFor={id}
      />

      {Boolean(helpText) && <FormHelperText>{helpText}</FormHelperText>}
    </FormControl>
  );
}

Checkbox.propTypes = {
  /** An unique ID for checkbox, required */
  id: PropTypes.string,

  /** The legend for the checkbox */
  legend: PropTypes.string,

  /** The label for the checkbox */
  label: PropTypes.string,

  /** The helper text for the checkbox */
  helpText: PropTypes.string,

  /** True if the checkbox is checked */
  checked: PropTypes.bool,

  /** True if error occurs */
  error: PropTypes.bool,

  /** The checkbox can be diabled */
  disabled: PropTypes.bool
};

