import React, { Component } from 'react';
import { CTLayout, CTFragment, CTErrorWrapper } from 'layout';
import { api } from 'utils';

import { XYPlot, LineSeries, XAxis, YAxis } from 'react-vis';

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
      ],
    },
  ],
};

export class Analytics extends Component {
  componentDidMount() {
    api.contentLoaded();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Personal Analytics',
        icon: 'bar_chart',
        sticky: true,
        gradient: true,
        offsetTop: 30,
      },
    });

    const mockViz = (
      <>
        {mockData.data.map((course) => (
          <>
            <h3>{course.courseName}</h3>
            <XYPlot
              height={300}
              width={500}
              xType="ordinal"
              getX={(d) => d.date}
              getY={(d) => d.duration}
            >
              <XAxis />
              <YAxis />
              <LineSeries data={course.watchHistory} />
            </XYPlot>
          </>
        ))}
      </>
    );

    return (
      <>
        <CTLayout {...layoutProps}>
          <CTFragment>
            <h2 align="center">Total time watched: {mockData.totalTimeWatched} minutes</h2>
            {mockViz}
          </CTFragment>
        </CTLayout>
      </>
    );
  }
}
