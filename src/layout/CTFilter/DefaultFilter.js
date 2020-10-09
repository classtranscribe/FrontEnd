import _ from 'lodash';
import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from 'pico-ui';
import CTFragment from '../CTFragment';

/**
 * Default input field component for CTFilter, a general filter component for classtranscribe
 * @example
 * // render the default input field for CTFilter which consists of an input field and a reverse button
 * const defaultFilterProps = {
      value: '',
      placeholder: 'Filter...',
      reversed: false,
      onInputChange: ({ target }) => setFilterVal(target.value),
      onToggleReverse: () => setThisReversed(rev => !rev),
    };
    <DefaultFilter {...defaultFilterProps} />;
 * 
 */
function DefaultFilter(props) {
  const {
    grey,
    value,
    placeholder,
    reversed,
    onInputChange,
    onToggleReverse,
    autoFocus = true,
    debounce = false,
    inputProps = {},
    ...fragmentProps
  } = props;

  const [inputVal, setInputVal] = useState(value);

  // check whether a reverse button should be provided
  const supportReverse = typeof onToggleReverse === 'function';
  const containerClasses = cx('ct-filter', 'd-input-con', { grey });
  const reverseBtnClasses = cx('ct-filter', 'reverse-btn', { reversed });

  // determine whether to apply debounce to onChange func
  const debouncedOnChange = useCallback(
    debounce ? _.debounce(onInputChange, 500) : onInputChange
  , []);

  const handleInputChange = ({ target, preventDefault }) => {
    setInputVal(target.value);
    debouncedOnChange({ target: { value: target.value }, preventDefault });
  };

  return (
    <CTFragment padding={[20, 0]} {...fragmentProps}>
      <div className={containerClasses}>
        <input 
          value={inputVal}
          placeholder={placeholder}
          onChange={handleInputChange}
          autoFocus={autoFocus}
          {...inputProps}
        />

        {
          supportReverse
          &&
          <Tooltip title={reversed ? 'Undo Reverse' : 'Reverse'}>
            <div>
              <Button
                round
                color={reversed ? 'transparent teal' : 'transparent'}
                icon="sort"
                classNames={reverseBtnClasses}
                onClick={onToggleReverse}
              />
            </div>
          </Tooltip>
        }
      </div>
    </CTFragment>
  );
}

DefaultFilter.propTypes = {
  ...CTFragment.propTypes,

  /** value in the input field */
  value: PropTypes.string,
  
  /** placeholder in the input field */
  placeholder: PropTypes.string,

  /** an indicator for whether the result is reversed, determining the appearance of the reverse button */
  reversed: PropTypes.bool,

  /** call-back function for changing the value in the input field */
  onInputChange: PropTypes.func,

  /** call-back function for clicking reverse button */
  onToggleReverse: PropTypes.func,

  /** Use the grey theme */
  grey: PropTypes.bool,

  autoFocus: PropTypes.bool,

  /** Apply debounce on onChange function */
  debounce: PropTypes.bool,
};

export default DefaultFilter;

