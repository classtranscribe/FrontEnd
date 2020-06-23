import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from 'pico-ui';
import CTFragment from '../CTFragment';

/**
 * default input field component for CTFilter: a general filter component for classtranscribe
 * @param {string} value - target values (delimitered by space)
 * @param {string} placeholder - placeholder
 * @param {bool} reversed - an indicator for whether the result is reversed
 * @param {function} onInputChange - call-back function for changing the value in the input field
 * @param {function} onToggleRerverse - call-back function for clicking reverse button
 * 
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
    value,
    placeholder,
    reversed,
    onInputChange,
    onToggleReverse,
  } = props;

  // check whether a reverse button should be provided
  const supportReverse = typeof onToggleReverse === 'function';
  const reverseBtnClasses = cx('ct-filter', 'reverse-btn', { reversed });

  return (
    <CTFragment padding={[20, 0]}>
      <div className="ct-filter d-input-con">
        <input 
          value={value}
          placeholder={placeholder}
          onChange={onInputChange}
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
  /** value in the input field */
  value: PropTypes.string,
  
  /** placeholder in the input field */
  placeholder: PropTypes.string,

  /** an indicator for whether the result is reversed, determining the appearance of the reverse button */
  reversed: PropTypes.bool,

  /** call-back function for changing the value in the input field */
  onInputChange: PropTypes.func,

  /** call-back function for clicking reverse button */
  onToggleReverse: PropTypes.func
};

export default DefaultFilter;

