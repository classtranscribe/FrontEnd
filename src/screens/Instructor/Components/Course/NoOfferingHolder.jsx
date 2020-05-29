import React from 'react';
import { Link } from 'react-router-dom';
import { links } from 'utils/links';
import { NEW_OFFERING_ID } from '../../Utils';

export default function NoOfferingHolder() {
  return (
    <div className="ip-nf-holder">
      Create your first offering
      <Link to={links.instOffering(NEW_OFFERING_ID)}>here</Link>
    </div>
  );
}
