import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import Filter from './Filter/Filter';
import mockData from '../mockData';
import Chart from './Chart/Chart';

export default function Plots() {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={3}>
          <Filter courses={mockData.data} />
        </Grid.Column>
        <Grid.Column width={13}>
          {mockData.data.map((course) => (
            <Chart course={course} />
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
