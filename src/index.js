import React from 'react'
import { Router, H } from 'dva/router'
import App from './App'
import dva from 'dva'
import { createBrowserHistory as createHistory } from 'history';
const history = createHistory();
const app = dva({history});
window.temp_app = app
app.model(require('./model/global').default);
app.model(require('./screens/Home/model').default); 
app.model(require('./screens/Search/model').default);
app.model(require('./screens/History/model').default);
app.model(require('./screens/Course/model').default);
app.router(({history}) => <Router history={history}><App app={app}/></Router>); // basename="/" 
app.start('#root')