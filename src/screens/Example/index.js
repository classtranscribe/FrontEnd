import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'layout';
import CTPlayer from 'components/CTPlayer';
import {
  setup,
  exampleStore,
  connectWithRedux
} from './controllers';

// import { OfferingList } from './components';

class ExampleWithRedux extends Component {
  constructor(props) {
    super(props);
    setup.init(props);
  }

  componentDidMount() {
    setup.setupExamplePage();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      responsive: true,
      transition: true,
      headingProps: {
        heading: 'Example',
      }
    });

    return (
      <CTLayout {...layoutProps}>
        {/* <OfferingList /> */}

        <CTFragment padding={[0, 30]}>
          {/* <CTPlayer
            width="800"
            mediaId="c9a54a76-9cf0-4ec2-ab2f-89d496326562"
            hideWrapperOnMouseLeave
            allowScreenshot
          /> */}

          <iframe 
            width="560" 
            height="315" 
            title="Information and Technology April 24, 2019" 
            frameBorder="0" 
            src={`${window.location.origin}/embed/c9a54a76-9cf0-4ec2-ab2f-89d496326562?lang=en-US`}
          />
        </CTFragment>
      </CTLayout>
    );
  }
}

export const Example = withReduxProvider(
  ExampleWithRedux,
  exampleStore,
  connectWithRedux,
  ['offerings'],
  ['all']
);
