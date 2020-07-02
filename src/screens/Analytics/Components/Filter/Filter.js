import React, { useState } from 'react';
import { Checkbox, Form, Segment } from 'semantic-ui-react';
import './Filter.scss';

export default function Filter(props) {
  const { courses } = props;
  const [checkedTimePeriod, setCheckedTimePeriod] = useState('week');
  const timePeriods = ['week', 'month', 'year'];

  return (
    <div className="filter-container">
      <h2>Filters</h2>
      <Segment>
        <h4>By Class</h4>
        {courses.map((course) => (
          <Checkbox label={course.courseName} />
        ))}
        <h4>By Time Period</h4>
        <Form>
          <Form.Field>
            {timePeriods.map((period) => (
              <Checkbox
                radio
                label={`Past ${period}`}
                name="timeFilterGroup"
                value={period}
                checked={checkedTimePeriod === period}
                onChange={(e, { value }) => setCheckedTimePeriod(period)}
              />
            ))}
          </Form.Field>
        </Form>
      </Segment>
    </div>
  );
}
