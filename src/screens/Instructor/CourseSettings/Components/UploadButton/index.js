import React from 'react';
import { Button } from 'semantic-ui-react';
import { CTFragment, CTFormHelp } from 'layout';
import './index.scss';

export function UploadButton({ addNew }) {
    return (
      <CTFragment>
        <CTFragment className="email-list-uploadbtw-container">
          <CTFormHelp title="INSTRUCTION">
            <CTFragment>
              Please upload a <strong>.csv/.txt file</strong> 
              with a <strong>list of emails</strong>.
            </CTFragment>
            <hr />
            <CTFragment className="email-list-uploadbtw-example">
              <h4><strong>EXAMPLAE</strong></h4>
              <CTFragment>{'<demo.txt>'}</CTFragment>
              <CTFragment>shawn@university.edu</CTFragment>
              <CTFragment>micheal2@university.edu</CTFragment>
              <CTFragment>xiaoming@university.edu</CTFragment>
              <CTFragment>...</CTFragment>
            </CTFragment>
          </CTFormHelp>

          <Button className="email-list-uploadbtw">
            Upload a csv/txt file
          </Button>
        </CTFragment>
      </CTFragment>
    );
}