import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';

export const useStyles = makeStyles({
  root: {
    '&.MuiIconButton-colorSecondary:hover': {
      backgroundColor: 'rgba(51, 138, 133, 0.13)'
    },
    '&.MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#348b86'
    }
  },
});

function Checkbox(props) {
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

  const checkboxProps = {
    id,
    disabled,
    checked,
    classes: useStyles(),
    onChange
  };

  const checkboxElement = (
    <MuiCheckbox {...checkboxProps} />
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
  disabled: PropTypes.bool,

  /** call back when value changed */
  onChange: PropTypes.func
};

Checkbox.useStyles = useStyles;

export default Checkbox;

