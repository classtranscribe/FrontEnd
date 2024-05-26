// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
// https://create-react-app.dev/docs/running-tests/
import '@testing-library/jest-dom';

// Similar to config.template but we put in placeholders for required fields
window.env={}
window.env.TEST_SIGN_IN='true'
// window.env.REACT_APP_FRONTEND_COMMIT_ENDPOINT="$REACT_APP_FRONTEND_COMMIT_ENDPOINT"
window.env.AUTH0_CLIENT_ID=""
window.env.AUTH0_DOMAIN=""
window.env.CILOGON_CLIENT_ID=""
// window.env.APPLICATION_INSIGHTS_KEY=""
// window.env.BRANCH=""
// window.env.BUILDNUMBER=""
// window.env.GITSHA1=""
