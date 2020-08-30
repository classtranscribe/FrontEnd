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
    },
    '& div[tabindex="0"]': {
      outline: 'none !important'
    }
  },
});

const useDarkStyles = makeStyles({
  root: {
    '& label': {
      color: 'white',
    },
    '& .MuiInput-underline::before, & .MuiInput-underline:hover::before': {
      borderBottomColor: 'white',
    },
    '& input': {
      color: 'white',
    },
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
    },
    '& div[tabindex="0"]': {
      outline: 'none !important'
    },
    '& input::selection': {
      background: 'white',
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
    onReturn,
    placeholder,
    defaultValue,
    value,
    darkMode,
    required = false,
    error = false,
    disabled = false,
    textarea = false,
    underlined = false,
    ...otherProps
  } = props;

  const classes = useStyles();
  const darkClasses = useDarkStyles();
  const handleKeyDown = (e) => {
    if (typeof onReturn === 'function' && e.keyCode === 13) {
      e.preventDefault();
      onReturn();
    }
  };

  return (
    <TextField
      fullWidth
      id={id}
      InputLabelProps={{ htmlFor: id }}
      type="text"
      variant={underlined ? "standard" : "outlined"}
      classes={darkMode ? darkClasses : classes}
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
      onKeyDown={handleKeyDown}
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

  /** The callback function when user hit return key */
  onReturn: PropTypes.func,

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

