import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { CTContextProvider } from './components'
import App from './App'

ReactDOM.render((
  <CTContextProvider>
    <Router basename="/">
      <App />
    </Router>
  </CTContextProvider>
), document.getElementById('root'));
