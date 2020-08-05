import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiRadio from '@material-ui/core/Radio';
import MuiRadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

export const useStyles = makeStyles({
  root: {
    '&.MuiIconButton-colorSecondary:hover': {
      backgroundColor: 'rgba(51, 138, 133, 0.13)'
    },
    '&.MuiRadio-colorSecondary.Mui-checked': {
      color: '#348b86'
    }
  },
});

function Radio(props) {
  let {
    id,
    legend,
    label  = [],
    helpText,
    error = false,
    onChange,
    value
  } = props;


  const RadioElement = (
    <MuiRadio classes = {useStyles()}/>
  );


  return (
    <FormControl required error={error} component="fieldset">
      {Boolean(legend) && <FormLabel component="legend">{legend}</FormLabel>}
      <MuiRadioGroup value={value} onChange={onChange}>
      {label.map((value, index) => (
        <FormControlLabel
        value = {index}
        control={RadioElement}
        label={value}
        />
      ))}
      </MuiRadioGroup>
      

      {Boolean(helpText) && <FormHelperText>{helpText}</FormHelperText>}
    </FormControl>
  );
}

Radio.propTypes = {
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

  /** The checkbox can be disabled */
  disabled: PropTypes.bool
};

Radio.useStyles = useStyles;

export default Radio;

