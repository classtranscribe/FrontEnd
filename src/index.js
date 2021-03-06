import React from 'react'
import { Router, H } from 'dva/router'
import { createBrowserHistory as createHistory } from 'history';
import dva from 'dva'
import App from './App'

const app = dva({ history: createHistory() });
window.temp_app = app
app.model(require('./model/global').default);
app.model(require('./screens/Home/model').default);
app.model(require('./screens/Search/model').default);
app.model(require('./screens/History/model').default);
app.model(require('./screens/Course/model').default);
app.model(require('./screens/Watch/model').default);
app.model(require('./screens/Watch/playermodel').default);

app.router(({ history }) => <Router history={history}><App app={app} /></Router>); // basename="/" 
app.start('#root')
/*
function registerModel(app, model) {
    try {
        app.model(model);
    } catch (e) { }
}
*/