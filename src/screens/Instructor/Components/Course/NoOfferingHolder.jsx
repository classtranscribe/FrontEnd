import React from 'react';
import { Link } from 'react-router-dom';
import { util } from 'utils';
import { NEW_OFFERING_ID } from '../../Utils';

export default function NoOfferingHolder() {
  return (
    <div className="ip-nf-holder">
      Create your first offering
      <Link to={util.links.instOffering(NEW_OFFERING_ID)}>here</Link>
    </div>
  );
}
