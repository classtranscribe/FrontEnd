import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import CustomTooltip from '../Tooltip/CustomTooltip';
import './Chart.scss';

export default function Chart(props) {
  const { course } = props;

  const renderCustomTooltip = (datum) => {
    if (datum.payload[0]) {
      return <CustomTooltip info={datum.payload[0].payload} />;
    }
    return null;
  };

  return (
    <>
      <h3>{course.courseName}</h3>
      <ResponsiveContainer width="95%" height={400}>
        <LineChart width={700} height={300} data={course.watchHistory}>
          <Line type="linear" dataKey="duration" stroke="#348b85" />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            dataKey="duration"
            label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={(datum) => renderCustomTooltip(datum)} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
