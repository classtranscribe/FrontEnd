import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import authentication from 'react-azure-adb2c'

import { 
  OfferingViewing, 
  InstructorProfile, 
  InstructorOffering,
  VideoPage,
  Admin,
} from './screens'
import './App.css'
import 'semantic-ui-css/semantic.min.css'


class App extends React.Component {
  render() {
    const NotFound404 = () => <div>404</div>
    return (
      <Router basename="/">
        <Switch>
          <Route exact path="/" component={OfferingViewing} />
          <Route path="/admin" component={authentication.required(Admin)} />
          <Route path="/student" component={authentication.required(OfferingViewing)} />
          <Route path="/instructor" component={authentication.required(InstructorProfile)} />
          <Route path="/offering/:id" component={authentication.required(InstructorOffering)} />
          <Route path="/video" component={VideoPage} />
          <Route component={NotFound404} />
        </Switch>
      </Router>
    )
  }
}

export default App
