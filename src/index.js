import React from 'react'
import { BrowserRouter as Router } from 'dva/router'
import App from './App'
import dva from 'dva'

const app = dva();
window.temp_app = app
app.model(require('./model/global').default);
app.model(require('./screens/Home/model').default);
app.model(require('./screens/Search/model').default);
app.model(require('./screens/History/model').default);
app.router(() => <Router basename="/"><App /></Router>);
app.start('#root')