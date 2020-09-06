import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';
import CTFragment from 'layout/CTFragment';

function ArrowButton(props) {
  const { isLeft } = props;
  const label = isLeft ? 'Left' : 'Right';
  const icon = isLeft ? 'chevron_left' : 'chevron_right';

  const btnClasses = cx('ct-h-scroll', 'arrow-btn', { left: isLeft, right: !isLeft });

  return (
    <CTFragment alignItCenter h100 aria-hidden="true">
      <ButtonBase aria-label={label} className={btnClasses}>
        <span className="material-icons">{icon}</span>
      </ButtonBase>
    </CTFragment>  
  );
}

ArrowButton.propTypes = {
  isLeft: PropTypes.bool
};

export default ArrowButton

