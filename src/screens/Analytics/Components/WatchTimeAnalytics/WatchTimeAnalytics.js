import React from 'react';
import { Grid } from 'semantic-ui-react';
import Filter from '../Filter/Filter';
import watchTimeData from '../../mockData/watchTimeData';
import Chart from '../Chart/Chart';

export default function Plots() {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={3}>
          <Filter courses={watchTimeData.data} />
        </Grid.Column>
        <Grid.Column width={13}>
          {watchTimeData.data.map((course) => (
            <Chart course={course} />
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
