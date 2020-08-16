import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import { CTText } from '../../CTText';
import { useStyles } from '../Input';

/**
 * The controlled select component used in `CTForm`
 */
function Select(props) {
  let {
    id,
    value,
    defaultValue,
    label,
    placeholder,
    helpText,
    options = [],
    error = false,
    required = false,
    disabled = false,
    underlined = false,
    multiple = false,
    onChange,
    noItemsHolder = 'No items',
    ...otherProps
  } = props;

  const classes = useStyles();
  const labelId = `ct-form-sel-label-${ id}`;

  let renderValue = null;
  if (multiple) {
    renderValue = (values) => values
      .map((val) => options.find(opt => opt.value === val).text)
      .join(', ');
  }

  return (
    <FormControl
      fullWidth
      error={error} 
      required={required} 
      disabled={disabled} 
      classes={classes}
      variant={underlined ? "standard" : "outlined"}
      className="ct-form-sel"
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <MuiSelect
        id={id}
        labelId={labelId}
        label={label}
        value={value}
        renderValue={renderValue}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        multiple={multiple}
        {...otherProps}
      >
        {options.length > 0 ? options.map(item => (
          <MenuItem dense key={item.value} value={item.value}>
            <ListItemText primary={item.text} secondary={item.description} />
          </MenuItem>
        )) : <CTText muted padding="10">{noItemsHolder}</CTText>}
      </MuiSelect>
      <FormHelperText>{helpText}</FormHelperText>
    </FormControl>
  );
}

Select.propTypes = {
  /** An unique ID to the selection */
  id: PropTypes.string.isRequired,

  /** The label for the selection */
  label: PropTypes.string,

  /** The placeholder for the selection */
  placeholder: PropTypes.string,

  /** The value for the selection */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /** The default value for the selection */
  defaultValue: PropTypes.string,

  /** The help text for the selection */
  helpText: PropTypes.string,

  /** The onchange callback for the selection */
  onChange: PropTypes.func,

  /** Options of the selection */
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string, 
      PropTypes.number
    ]),
    text: PropTypes.string,
    description: PropTypes.string,
  })),

  /** True if the input is required */
  required: PropTypes.bool,

  /** True when error occurs */
  error: PropTypes.bool,

  /** The input field can be disabled */
  disabled: PropTypes.bool,

  /** The input field can be underlined */
  underlined: PropTypes.bool,

  /** Use multiple select */
  multiple: PropTypes.bool,

  /** text holder when no selection options available */
  noItemsHolder: PropTypes.string
};

export default Select;