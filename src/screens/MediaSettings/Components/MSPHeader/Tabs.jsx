import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { util } from 'utils';
import { mspTabs } from '../../Utils';

function Tabs() {
  const { id } = useParams();
  const location = useLocation();

  return (
    <div className="msp-h-tabs-con">
      {mspTabs.map( tab => (
        <Link 
          id={tab.id} 
          key={tab.id}  
          className="plain-btn msp-h-tab"
          data-current={location.pathname === util.links.instMediaSettings(id, tab.hash)}
          to={util.links.instMediaSettings(id, tab.hash)}
        >
          <span tabIndex="-1">
            {tab.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default Tabs;