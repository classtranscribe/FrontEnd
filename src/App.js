import React from 'react';
import { HashRouter as Router, Route} from 'react-router-dom';
// import {  } from 'react-router';
// import axios from 'axios';
// import authentication from 'react-azure-adb2c';

import { 
  LoginPage as Homepage, 
  StudentsPage, 
  InstProfilePage, 
  InstOfferingPage,
  VideoPage,
  AdminPage,
} from './pages';
import './App.css';
import 'semantic-ui-css/semantic.min.css';


class App extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  

  render() {
    return (
      <Router basename="/class-transcribe-frontend">
        <Route exact path="/" component={Homepage} />
        {/* <Route path="/courses" component={authentication.required(StudentsPage)} />
        <Route path="/instructor/:id" component={authentication.required(InstProfilePage)} />
        <Route path="/course/:index" component={authentication.required(InstOfferingPage)} /> */}
        <Route path="/admin" component={AdminPage} />
        <Route path="/courses" component={StudentsPage} />
        <Route path="/instructor/:id" component={InstProfilePage} />
        <Route path="/course/:index" component={InstOfferingPage} />
        <Route path="/video" component={VideoPage} />
      </Router>
    );
  }
}

export default App;
