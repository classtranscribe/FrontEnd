import React from 'react';
import cx from 'classnames';
import { CTFragment } from 'layout';
import './index.scss';

import Info from './Info';
import List from './List';

function InfoAndListLayout(props) {
  const {
    id,
    className,
    children,
    ...fragmentProps
  } = props;

  const infoNLiClasses = cx('ct-info-n-li', 'inl-container', className);

  return (
    <CTFragment id={id} className={infoNLiClasses} {...fragmentProps}>
      {children}
    </CTFragment>
  );
}

InfoAndListLayout.propTypes = CTFragment.propTypes;
InfoAndListLayout.Info = Info;
InfoAndListLayout.List = List;

export default InfoAndListLayout;

