import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import b2cauth from 'react-azure-adb2c'

// b2cauth.initialize({
//   instance: process.env.REACT_APP_AZURE_B2C_INSTANCE, 
//   tenant: process.env.REACT_APP_AZURE_B2C_TENANT,
//   signInPolicy: process.env.REACT_APP_AZURE_B2C_SIGNIN_POLICY,
//   applicationId: process.env.REACT_APP_AZURE_B2C_APPLICATION_ID,
//   cacheLocation: 'sessionStorage',
//   scopes: [process.env.REACT_APP_AZURE_B2C_SCOPES],
//   redirectUri: 'http://localhost:3000/class-transcribe-frontend/',
//   postLogoutRedirectUri: window.location.origin,
// });

// authentication.initialize({
//   instance: 'https://login.microsoftonline.com/tfp/', 
//   tenant: 'classtranscribe.onmicrosoft.com',
//   signInPolicy: 'B2C_1_Signin',
//   applicationId: '0291d355-ef13-4415-a2dc-d089b9c08766',
//   cacheLocation: 'sessionStorage',
//   scopes: ['https://classtranscribe.onmicrosoft.com/api/user_impersonation'],
//   redirectUri: 'http://localhost:3000/',
//   postLogoutRedirectUri: window.location.origin,
// });

// b2cauth.run(() => {
//   ReactDOM.render(<App />, document.getElementById('root'));
//   serviceWorker.unregister();
// });


ReactDOM.render((
  <App />
), document.getElementById('root'));
serviceWorker.unregister();
