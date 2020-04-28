import { cthttp } from './request'


// ------------------------------------------------------------
// SignIn
// ------------------------------------------------------------

export function accountSignIn(auth0Token) {
    return cthttp.post('Account/SignIn', { auth0Token })
}

export function testAccountSignIn() {
    return cthttp.get('Account/TestSignIn')
}

export function loginAsAccountSignIn(emailId) {
    return cthttp.post('Account/LoginAs', { emailId })
}

// ------------------------------------------------------------
// User Metadata
// ------------------------------------------------------------

export function getUserMetaData() {
    return cthttp.get('Account/GetUserMetadata/GetUserMetadata')
}

export function postUserMetaData(metadata={}, onboard={}) {
    return cthttp.post('Account/PostUserMetadata/PostUserMetadata', { ...metadata, onboard })
}