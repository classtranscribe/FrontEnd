import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from 'pico-ui';
import { CTFragment } from '../CTFragment';

function DefaultFilter(props) {
  const {
    value,
    placeholder,
    reversed,
    onInputChange,
    onToggleReverse,
  } = props;

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
  value: PropTypes.string,
  placeholder: PropTypes.string,
  reversed: PropTypes.bool,
  onInputChange: PropTypes.func,
  onToggleReverse: PropTypes.func
};

export default DefaultFilter;

