import React, { Component } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Plots.scss';

const mockData = {
  totalTimeWatched: 120,
  data: [
    {
      courseName: 'Artificial Intelligence',
      watchHistory: [
        {
          date: '06/09/2020',
          duration: 40,
          videoName: 'Reinforcement Learning',
        },
        {
          date: '06/08/2020',
          duration: 20,
          videoName: 'Q-Learning',
        },
        {
          date: '06/07/2020',
          duration: 50,
          videoName: 'Minimax',
        },
      ],
    },
    {
      courseName: 'Machine Learning',
      watchHistory: [
        {
          date: '06/09/2020',
          duration: 20,
          videoName: 'Gradient Descent',
        },
        {
          date: '06/08/2020',
          duration: 70,
          videoName: 'SVMs',
        },
        {
          date: '06/07/2020',
          duration: 35,
          videoName: 'KNN',
        },
        {
          date: '06/06/2020',
          duration: 100,
          videoName: 'More',
        },
        {
          date: '06/05/2020',
          duration: 20,
          videoName: 'More 1',
        },
        {
          date: '06/04/2020',
          duration: 25,
          videoName: 'More 2',
        },
        {
          date: '06/03/2020',
          duration: 50,
          videoName: 'More 3',
        },
        {
          date: '06/02/2020',
          duration: 35,
          videoName: 'More 4',
        },
      ],
    },
  ],
};

const renderCustomTooltip = (datum) => {
  if (datum.payload[0]) {
    const { date, duration, videoName } = datum.payload[0].payload;
    return (
      <div className="tooltip-box">
        <div className="text-box">
          <p>Date: {date}</p>
          <p>Duration: {duration} min</p>
          <p>Video: {videoName}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function Plots() {
  return (
    <div className="plot-container">
      {mockData.data.map((course) => (
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
      ))}
    </div>
  );
}
