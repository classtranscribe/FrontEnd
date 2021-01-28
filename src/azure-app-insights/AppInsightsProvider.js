import { Component } from 'react';
import { withRouter } from 'dva/router';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { env, isDeveloping } from 'utils';
import { appInsightsService } from './service';

/**
 * This Component provides telemetry with Azure App Insights
 *
 * NOTE: the package '@microsoft/applicationinsights-react-js' has a HOC withAITracking
 * that requires this to be a Class Component rather than a Functional Component
 */
class AppInsightsProvider extends Component {
  constructor() {
    super();
    this.state = {
      initialized: false,
    };
  }

  componentDidMount() {
    // Disable azure app insights for localhost developing
    if (isDeveloping) {
      return;
    }

    const { history } = this.props;
    const { initialized } = this.state;
    const instrumentationKey = env.azureInstrumentationKey;

    if (!initialized && Boolean(instrumentationKey) && Boolean(history)) {
      appInsightsService.initialize(instrumentationKey, history);
      this.setState({ initialized: true });
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default withRouter(
  withAITracking(
    appInsightsService.reactPlugin,
    AppInsightsProvider,
    '',
    'ct-app-insight-provider',
  ),
);
