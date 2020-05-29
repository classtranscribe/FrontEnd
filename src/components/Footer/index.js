import React from 'react';
import { Grid } from 'semantic-ui-react';
import './index.css';

export function ClassTranscribeFooter() {
  return (
    <footer className="ct-footer" aria-label="Footer">
      <Grid stackable columns="equal" verticalAlign="middle" textAlign="center">
        <Grid.Row>
          <Grid.Column className="copy">&copy; 2016-2020 University of Illinois</Grid.Column>
        </Grid.Row>
      </Grid>
    </footer>
  );
}
