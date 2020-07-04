import React from 'react';
import cx from 'classnames';
import { CTFragment } from 'layout';
import './index.scss';

function Info(props) {
  const {
    id,
    className,
    children,
    ...fragmentProps
  } = props;

  const infoNLiClasses = cx('ct-info-n-li', 'info', className);

  return (
    <CTFragment id={id} className={infoNLiClasses} {...fragmentProps} data-scroll>
      {children}
    </CTFragment>
  );
}

Info.propTypes = CTFragment.propTypes;
export default Info;

