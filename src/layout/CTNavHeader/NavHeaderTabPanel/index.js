import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import { NavHeaderTab, NavHeaderTabPropTypes } from './NavHeaderTab';

export function NavHeaderTabPanel(props) {
  let {
    tabs = [],
    tabTitleElem,
  } = props;

  return (
    <div className="ct-nh-tab-panel">
      <div className="ct-nh-tab-title-con">
        {tabTitleElem}
      </div>

      <div className="ct-nh-tabs-con">
        {tabs.map(tab => <NavHeaderTab key={tab.text} {...tab} />)}
      </div>
    </div>
  );
}

export const NavHeaderTabPanelPropsTypes = {
  /** Nav tab objects */
  tabs: PropTypes.arrayOf(PropTypes.shape(NavHeaderTabPropTypes)),

  /** The Nav Header can have a title element for tabs */
  tabTitleElem: PropTypes.node,
};

NavHeaderTabPanel.propTypes = NavHeaderTabPanelPropsTypes;
