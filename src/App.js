import React from 'react'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import { 
  LoginAndLogout,
  Admin,
  Instructor,
  MediaSettings,
  OfferingViewing, 
  Watch,
  NotFound404,
  Maintenance,
} from './screens'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
// import { CTContext } from './components'
import { user } from './utils'

class App extends React.Component {
  componentDidMount() {
    user.checkExpiration()
  }

  // componentDidUpdate(prevProps) {
  //   const { location } = this.props
  //   if (location !== prevProps.location) {
  //     const { removeAlert } = this.context
  //     removeAlert()
  //   }
  // }

  render() {
    // return <Maintenance />
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route exact path="/login" component={LoginAndLogout} />
        <Route exact path="/logout" component={LoginAndLogout} />

        {/* Admin */}
        <Route path="/admin" component={Admin} />

        {/* Instructor */}
        <Route exact path="/instructor" component={Instructor} />
        <Route exact path="/instructor/media-settings/:id" component={MediaSettings} />

        {/* Student */}
        <Route path="/home" component={OfferingViewing} />
        <Route exact path="/video" component={Watch} />

        <Route path="/404" component={NotFound404} />
        <Route component={NotFound404} />
      </Switch>
    )
  }
}

// App.contextType = CTContext

export default withRouter(App)
