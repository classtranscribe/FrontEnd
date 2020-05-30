import React from 'react';
import { Link } from 'react-router-dom';
import { links } from 'utils/links';
import './index.scss';

function CourseResultItem(props) {
  let { offering } = props;

  const {
    id,
    fullNumber,
    courseName,
    description,
    termName,
    sectionName,
  } = offering;

  return (
    <div role="listitem" id={`sp-res-li-${id}`} className="sp-res-li">
      <div className="sp-res-title">
        <Link to={links.offeringDetail(id)} className="number">
          {fullNumber}
        </Link>

        <div className="name">{courseName}</div>
      </div>

      <div className="term">{termName} | {sectionName}</div>

      <div className="description">{description}</div>
    </div>
  );
}

export default CourseResultItem;
