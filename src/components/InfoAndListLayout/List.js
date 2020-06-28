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

  const infoNLiClasses = cx('ct-info-n-li', 'list', className);

  return (
    <CTFragment id={id} className={infoNLiClasses}>
      <CTFragment {...fragmentProps} className="ct-info-n-li scroll-view" data-scroll>
        {children}
      </CTFragment>
    </CTFragment>
  );
}

Info.propTypes = CTFragment.propTypes;
export default Info;

