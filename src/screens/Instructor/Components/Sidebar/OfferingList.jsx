import React from 'react';
import { ListItem } from '../ListItem';

function OfferingList({
  results = [],
  currTermId,
  noOffering = false,
  currOfferingId,
  handleOfferingClick,
}) {
  const currOfferings = [];
  const pastOfferings = [];

  results.forEach((off) => {
    if (off.termId === currTermId) currOfferings.push(off);
    else pastOfferings.push(off);
  });

  return (
    <div className="ct-list-col ip-sb-off-list" role="list">
      {noOffering ? (
        <div aria-hidden="true" className="w-100 ct-d-c-center">
          <div className="text-muted">No Courses</div>
        </div>
      ) : (
        <>
          {currOfferings.length > 0 && (
            <>
              <div className="ip-sb-subt" aria-hidden="true">
                CURRENT COURSES
              </div>
              {currOfferings.map((off) => (
                <div key={off.id} role="listitem">
                  <ListItem
                    title={off.courseNumber}
                    subtitle={off.courseName}
                    description={`${off.term.name} | ${off.sectionName}`}
                    current={Boolean(currOfferingId === off.id)}
                    onClick={handleOfferingClick(off)}
                  />
                </div>
              ))}
            </>
          )}
          {pastOfferings.length > 0 && (
            <>
              <div className="ip-sb-subt mt-4" aria-hidden="true">
                PAST COURSES
              </div>
              {pastOfferings.map((off) => (
                <div key={off.id} role="listitem">
                  <ListItem
                    title={off.courseNumber}
                    subtitle={off.courseName}
                    description={`${off.term.name} | ${off.sectionName}`}
                    current={Boolean(currOfferingId === off.id)}
                    onClick={handleOfferingClick(off)}
                  />
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default OfferingList;
