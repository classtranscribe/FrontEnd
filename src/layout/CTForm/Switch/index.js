import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiSwitch from '@material-ui/core/Switch';

const TealSwitch = withStyles({
  switchBase: {
    color: 'grey',
    '&.MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#348b86',
    },
    '&.MuiSwitch-colorSecondary.Mui-checked': {
      color: '#348b86',
    },
    '&.MuiSwitch-colorSecondary.Mui-checked:hover': {
      backgroundColor: 'rgba(51, 138, 133, 0.13)',
      color: '#348b86',
    },
  }
})(MuiSwitch);

function Switch(props) {
  const {
    id,
    label,
    checked,
    onChange,
    disabled,
    required,
    helpText
  } = props;

  const switchElement = (
    <TealSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      required={required}
    />
  );

  return (
    <>
      <FormControlLabel id={id} control={switchElement} label={label} />
      {helpText && <FormHelperText>{helpText}</FormHelperText>}
    </>
  );
}

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  helpText: PropTypes.string,
};

export default Switch;

