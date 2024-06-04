import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { search } from '../../../utils/search/index.js'
import * as KeyCode from 'keycode-js';
import { AdminListItem } from '../Components';

export default function InstructorList({ instructors, loading, currUni, onInactive }) {
  const [result, setResult] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setResult(instructors);
  }, [instructors]);

  const onSearch = (keyCode) => {
    if (keyCode === KeyCode.KEY_RETURN) {
      setResult(
        search.getResults(instructors, searchText, [
          'firstName',
          'lastName',
          'email',
        ]),
      );
    }
  };

  const onReset = () => {
    setResult(instructors);
    setSearchText('');
  };

  const formatInstructorName = (instructor) => {
    if (!(instructor.firstName || instructor.lastName)) {
      return "Unknown"; 
    }

    return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim();;
  }

  return (
    <>
      <div className="filter">
        <label htmlFor="inst-filter">Search:
          <input
            id="inst-filter"
            placeholder="Name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={({ keyCode }) => {
              return onSearch(keyCode);
            }}
          />
        </label>
        <Button basic icon="search" aria-label="search" onClick={() => onSearch(KeyCode.KEY_RETURN)} />
        <Button basic content="Reset" onClick={onReset} />
      </div>
      {result.map((inst) => (
        <AdminListItem
          header={formatInstructorName(inst)}
          path="instructor"
          inactive={() => onInactive(inst.email)}
          loading={loading}
          id={inst.id}
          key={inst.id}
          items={[`University: ${currUni.name}`, `Email: ${inst.email}`]}
        />
      ))}
    </>
  );
}
