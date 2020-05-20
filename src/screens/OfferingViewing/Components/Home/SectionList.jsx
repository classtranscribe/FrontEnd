/**
 * Offering List Component lists all accessible offerings for a user
 * - offerings are organized by departments
 */

import React from 'react';
import { OfferingListHolder, ReloadContents } from './PlaceHolder';
import Section from './Section';

export default function SectionList({
  state,
  offerings,
  watchHistory,
  starredOfferings,
  getOfferingsByStudent,
  displaySearchHeader,
  ...functions
}) {
  const { departments, departSelected, termSelected } = state;
  if (offerings[0] === 'Unloaded' || departments[0] === 'unloaded') return <OfferingListHolder />;
  if (offerings[0] === 'retry' || departments[0] === 'retry')
    return <ReloadContents onRetry={getOfferingsByStudent} />;

  function notEmpty(depart) {
    for (let i = 0; i < offerings.length; i += 1) {
      const hasOfferings = offerings[i].departmentIds.includes(depart.id);
      const hasTerm = !termSelected.length || termSelected.includes(offerings[i].termId);
      if (hasOfferings && hasTerm) return true;
    }
    return false;
  }

  let nonEmptyDepartments = [];
  for (let i = 0; i < departments.length; i += 1) {
    if (
      (!departSelected.length || departSelected.includes(departments[i].id)) &&
      notEmpty(departments[i])
    ) {
      nonEmptyDepartments.push(departments[i]);
    }
  }

  if (nonEmptyDepartments.length === 0) {
    return <OfferingListHolder noCourse />;
  }

  // sections
  const sections = ['history', ...nonEmptyDepartments];
  const onFilter = departSelected.length > 0 || termSelected.length > 0;

  return (
    <div className="offering-list" role="list">
      {/* Starred */}
      {!onFilter && (
        <Section
          {...functions}
          type="starred"
          offerings={offerings}
          state={state}
          starredOfferings={starredOfferings}
        />
      )}
      {/* History */}

      {/* Offerings */}
      {sections.map((section) =>
        section === 'history' ? (
          onFilter ? null : (
            <Section
              {...functions}
              key="history-section"
              type="history"
              offerings={offerings}
              state={state}
              watchHistory={watchHistory}
              starredOfferings={starredOfferings}
            />
          )
        ) : section ? (
          <Section
            {...functions}
            key={section.id}
            type="department"
            depart={section}
            offerings={offerings}
            state={state}
            displaySearchHeader={displaySearchHeader}
            starredOfferings={starredOfferings}
          />
        ) : null,
      )}
    </div>
  );
}
