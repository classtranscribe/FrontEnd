import { cthttp } from './request'


// ------------------------------------------------------------
// SignIn
// ------------------------------------------------------------

export function accountSignIn(token, authMethod) {
    return cthttp.post('Account/SignIn', { token, authMethod });
}

export function testSignIn() {
    return cthttp.get('Account/TestSignIn');
}

export function loginAsAccountSignIn(emailId) {
    return cthttp.post('Account/LoginAs', { emailId });
}

// ------------------------------------------------------------
// User Metadata
// ------------------------------------------------------------

export function getUserMetaData() {
    return cthttp.get('Account/GetUserMetadata/GetUserMetadata');
}

export function postUserMetaData(metadata={}, onboard={}) {
    return cthttp.post('Account/PostUserMetadata/PostUserMetadata', { ...metadata, onboard });
}