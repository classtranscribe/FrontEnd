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
  legend: {
    fontWeight: 'bold',
    color: '#3d3d3d',
    '&.Mui-focused': {
      color: '#348b86'
    }
  },
  formCtrlLabel: {
    marginBottom: 0
  }
});

function Radio(props) {
  let {
    id,
    legend,
    options = [],
    helpText,
    error = false,
    onChange,
    value
  } = props;

  const classes = useStyles();
  const RadioElement = <MuiRadio classes={classes} />;

  return (
    <FormControl id={id} required error={error} component="fieldset">
      {Boolean(legend) && <FormLabel className={classes.legend} component="legend">{legend}</FormLabel>}
      <MuiRadioGroup value={value} onChange={onChange}>
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            label={opt.text}
            control={RadioElement}
            className={classes.formCtrlLabel}
          />
        ))}
      </MuiRadioGroup>
      

      {Boolean(helpText) && <FormHelperText>{helpText}</FormHelperText>}
    </FormControl>
  );
}

Radio.propTypes = {
  /** An unique ID for radio group, required */
  id: PropTypes.string,

  /** The legend for the radio group */
  legend: PropTypes.string,

  /** The label for the radio group */
  options: PropTypes.array,

  /** The helper text for the radio group */
  helpText: PropTypes.string,

  /** True if the radio group is checked */
  checked: PropTypes.bool,

  /** True if error occurs */
  error: PropTypes.bool,

  /** The radio group can be disabled */
  disabled: PropTypes.bool
};

Radio.useStyles = useStyles;

export default Radio;

