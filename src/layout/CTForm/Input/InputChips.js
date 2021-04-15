import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input'

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
function InputChip(props) {
  let {
    id,
    label,
    helpText,
    onAdd,
    onDelete,
    value,
    darkMode,
    sort = false,
    required = false,
    error = false,
    disabled = false,
    textarea = false,
    underlined = false,
    ...otherProps
  } = props;
  
  const classes = useStyles();
  const darkClasses = useDarkStyles();
  
  return (
    <ChipInput
      fullWidth={true}
      label={label}
      variant="outlined"
      classes={darkMode ? darkClasses : classes} 
      value={sort? value.sort(): value}
      onAdd={(chip) => onAdd(chip)}
      onDelete={(chip, index) => onDelete(chip, index)}
    />
  );
}



InputChip.propTypes = {
  /** An unique ID to the input */
  id: PropTypes.string,

  /** The label for the input */
  label: PropTypes.string,

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

export default InputChip;

