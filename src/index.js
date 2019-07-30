import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import * as serviceWorker from './serviceWorker'
import authentication from 'react-azure-adb2c'

authentication.initialize({
  instance: process.env.REACT_APP_AZURE_B2C_INSTANCE, 
  tenant: process.env.REACT_APP_AZURE_B2C_TENANT,
  signInPolicy: process.env.REACT_APP_AZURE_B2C_SIGNIN_POLICY,
  applicationId: process.env.REACT_APP_AZURE_B2C_APPLICATION_ID,
  cacheLocation: 'sessionStorage',
  scopes: [process.env.REACT_APP_AZURE_B2C_SCOPES],
  redirectUri: process.env.REACT_APP_AZURE_B2C_REDIRECT_URI,
  postLogoutRedirectUri: window.location.origin,
});

// authentication.run(() => {
//   ReactDOM.render(<App />, document.getElementById('root'));
//   serviceWorker.register();
// });


ReactDOM.render((
  <App />
), document.getElementById('root'));
serviceWorker.unregister();
