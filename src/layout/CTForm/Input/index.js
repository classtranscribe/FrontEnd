import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

export const useStyles = makeStyles({
  root: {
    '& label.Mui-focused': {
      color: '#348b86',
      fontWeight: 'bold'
    },
    '& .MuiInput-underline.Mui-focused::after': {
      borderBottomColor: '#348b86',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#348b86',
      }
    }
  },
});

/**
 * The controlled input component used in `CTForm`
 */
function Input(props) {
  let {
    id,
    label,
    helpText,
    onChange,
    placeholder,
    defaultValue,
    value,
    required = false,
    error = false,
    disabled = false,
    textarea = false,
    underlined = false,
    ...otherProps
  } = props;

  const inputClasses = useStyles();

  return (
    <TextField
      fullWidth
      id={id}
      InputLabelProps={{ htmlFor: id }}
      type="text"
      variant={underlined ? "standard" : "outlined"}
      classes={inputClasses}
      label={label}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      helperText={helpText}
      onChange={onChange}
      multiline={textarea}
      error={error}
      required={required}
      disabled={disabled}
      {...otherProps}
    />
  );
}

Input.propTypes = {
  /** An unique ID to the input */
  id: PropTypes.string.isRequired,

  /** The label for the input */
  label: PropTypes.string,

  /** The placeholder for the input */
  placeholder: PropTypes.string,

  /** The default value for the input */
  defaultValue: PropTypes.string,

  /** The value for the input */
  value: PropTypes.string,

  /** The help text for the input */
  helpText: PropTypes.string,

  /** The onchange callback for the input */
  onChange: PropTypes.func,

  /** The input can be a textarea */
  textarea: PropTypes.bool,

  /** True if the input is required */
  required: PropTypes.bool,

  /** True when error occurs */
  error: PropTypes.bool,

  /** The input field can be disabled */
  disabled: PropTypes.bool,

  /** The input field can be underlined */
  underlined: PropTypes.bool
};

export default Input;

