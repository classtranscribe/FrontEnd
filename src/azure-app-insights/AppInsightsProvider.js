import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { withAITracking } from '@microsoft/applicationinsights-react-js'
import { env } from 'utils'
import { appInsightsService } from './service'

/**
 * This Component provides telemetry with Azure App Insights
 *
 * NOTE: the package '@microsoft/applicationinsights-react-js' has a HOC withAITracking that requires this to be a Class Component rather than a Functional Component
 */
class AppInsightsProvider extends Component {
    state = {
        initialized: false
    }

    componentDidMount() {
        const { history, after } = this.props
        const { initialized } = this.state
        const instrumentationKey = env.azureInstrumentationKey

        if (!Boolean(initialized) && Boolean(instrumentationKey) && Boolean(history)) {
            appInsightsService.initialize(instrumentationKey, history)
            this.setState({initialized: true})
        }

        if (typeof after === 'function') {
          after()
        }
    }

    render() {
        const { children } = this.props
        return (
            <Fragment>
                {children}
            </Fragment>
        )
    }
}

export default withRouter(
  withAITracking(
    appInsightsService.reactPlugin, 
    AppInsightsProvider,
    '',
    'ct-app-insight-provider'
  )
)