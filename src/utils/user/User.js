/**
 * The object for setting up user (get token & userId)
 *  and get user information
 */

import _ from 'lodash';
import decoder from 'jwt-decode';
import * as Account from '../cthttp/entities/Account';
// import { getLatestGitCommitSHA } from '../cthttp/requests/general';
import { env } from '../env';
import { links } from '../links';
import { prompt } from '../prompt';
import { uurl } from '../use-url';

import { Auth0 } from './Auth0';
import { CILogon } from './CILogon';
import { accountStorage } from './storage';

import {
  // user roles
  ROLE_ADMIN,
  ROLE_INST,
  // auth methods
  AUTH_AUTH0,
  AUTH_CILOGON,
  AUTH_TEST,
  TOKEN_INFO_ROLES,
  TOKEN_INFO_GIVEN_NAME,
  TOKEN_INFO_FAMILY_NAME,
} from './constants';

export class User {
  constructor() {
    this.auth0Client = new Auth0();
    this.ciLogonClient = new CILogon();

    // binding
    this.signIn = this.signIn.bind(this);
    this.reSignIn = this.reSignIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.validate = this.validate.bind(this);
    this.checkAppVersion = this.checkAppVersion.bind(this);
    this.testSignIn = this.testSignIn.bind(this);
    this.loginAsAccountSignIn = this.loginAsAccountSignIn.bind(this);
    this.loginAsAccountSignOut = this.loginAsAccountSignOut.bind(this);
  }

  /** Auth methods */
  method = {
    AUTH0: AUTH_AUTH0,
    CILOGON: AUTH_CILOGON,
    TEST: AUTH_TEST,
  };

  authMethods = [
    AUTH_AUTH0,
    AUTH_CILOGON,
    AUTH_TEST
  ];

  callbackPaths = [links.auth0Callback(), links.ciLogonCallback()];

  /** return true if the user is logged in */
  get isLoggedIn() {
    return Boolean(this.userId);
  }

  /** return true if the user is an admin */
  get isAdmin() {
    const roles = this.getUserInfo({ allowLoginAsOverride: false }).roles || [];
    return _.includes(roles, ROLE_ADMIN);
  }

  /** return true if the user is an instructor */
  get isInstructor() {
    const roles = this.getUserInfo({ allowLoginAsOverride: false }).roles || [];
    return _.includes(roles, ROLE_INST);
  }

  /** returns the id of the user, or test id if it exists */
  get userId() {
    if (uurl.isEqual(links.admin())) {
      // if it's in admin page
      return this.getUserInfo().userId;
    }

    return this.getLoginAsUserInfo().userId || this.getUserInfo().userId;
  }

  // ---------------------------------------------------------------------------
  // Sign in
  // ---------------------------------------------------------------------------
  /** method: `Auth0`, `CILogon`, `Test` */
  signIn(
    options = {
      method: AUTH_AUTH0,
      redirectURL: window.location.href,
      closeAfterSignedIn: false
    },
  ) {
    const { method, redirectURL, closeAfterSignedIn } = options;
    if (closeAfterSignedIn) {
      accountStorage.setCloseAfterSignedIn();
    } else { // Remove any old settings
      accountStorage.rmCloseAfterSignedIn();
    }
    

    if (env.dev && method === AUTH_TEST) {
      this.testSignIn(redirectURL);
    } else if (method === AUTH_CILOGON) {
      this.ciLogonSignIn(redirectURL);
    } else {
      this.auth0SignIn(redirectURL);
    }
  }

  auth0SignIn(redirectURL) {
    this.auth0Client.signIn(redirectURL);
  }

  ciLogonSignIn(redirectURL) {
    this.ciLogonClient.authorize(redirectURL);
  }

  async testSignIn(redirectURL) {
    const { data } = await Account.testSignIn();
    const { authToken } = data;
    // Save AuthToken
    accountStorage.setAuthToken(authToken);
    // Save user info
    this.saveUserInfo(data, {}, AUTH_TEST);

    this.execCloseAfterSignIn();
    window.location = redirectURL;
  }

  reSignIn() {
    const { authMethod } = this.getUserInfo({ allowLoginAsOverride: false });
    localStorage.clear();
    this.signIn({ method: authMethod });
  }

  // ---------------------------------------------------------------------------
  // Sign out
  // ---------------------------------------------------------------------------

  signOut(returnTo) {
    const { authMethod } = this.getUserInfo();
    if (!this.isLoggedIn) return;
    localStorage.clear();

    switch (authMethod) {
      case AUTH_TEST:
        this.testSignOut(returnTo || window.location.origin);
        break;
      case AUTH_CILOGON:
        this.ciLogonSignOut(returnTo || window.location.origin);
        break;
      default:
        this.auth0SignOut(returnTo || window.location.origin);
    }
  }

  auth0SignOut(returnTo) {
    this.auth0Client.signOut(returnTo);
  }

  ciLogonSignOut(returnTo) {
    window.location = returnTo;
  }

  testSignOut(returnTo) {
    window.location = returnTo;
  }

  // ---------------------------------------------------------------------------
  // Setup user
  // ---------------------------------------------------------------------------

  async setupUser(token, profile, method, callbackURL) {
    let userData = null;
    try {
      // GET user data from backend
      const fullCallbackURL = window.location.origin + callbackURL;
      const { data } = await Account.accountSignIn(token, method, fullCallbackURL);
      if (!data) {
        throw Error(`No data returned in the sign-in request's response.`);
      }

      userData = data;
    } catch (error) {
      console.error('Failed to get user data and auth token from backend', error);
      return false;
    }

    try {
      // Save AuthToken
      accountStorage.setAuthToken(userData.authToken);
      // Save userInfo
      this.saveUserInfo(userData, profile, method);

      // Done
      return true;
    } catch (error) {
      console.error('Failed to save user data and auth token.', error);
    }

    return false;
  }

  redirect(path) {
    let redirectURL = path;
    if (redirectURL === links.home()) {
      // redirect admins and instructors to their page
      if (this.isAdmin) {
        redirectURL = links.admin();
      } else if (this.isInstructor) {
        redirectURL = links.instructor();
      }
    }

    window.location = redirectURL;
  }

  /**
   * Setup user after loading user info and `id_token` from Auth0
   */
  async auth0Setup() {
    if (this.isLoggedIn) {
      window.location = links.home();
    }

    // load user info and `id_token` from Auth0
    try {
      await this.auth0Client.handleAuthentication();
    } catch (error) {
      console.error('Failed to parse Auth0 id_token', error);
      return;
    }

    // get authToken from backend using auth0's `id_token`
    const idToken = this.auth0Client.getAuth0Token();
    const profile = this.auth0Client.getProfile();
    const successed = await this.setupUser(idToken, profile, AUTH_AUTH0, links.auth0Callback());
    this.execCloseAfterSignIn();
    if (!successed) {
      return;
    }

    // start redirecting
    const redirectURL = this.auth0Client.getRedirectURL(); // default redirect url
    this.redirect(redirectURL);
  }

  async ciLogonSetup() {
    if (this.isLoggedIn) {
      window.location = links.home();
    }

    const { token, redirect_uri } = this.ciLogonClient.parseCallback();

    const successed = await this.setupUser(token, {}, AUTH_CILOGON, links.ciLogonCallback());
    this.execCloseAfterSignIn();
    if (!successed) {
      return;
    }

    this.redirect(redirect_uri);
  }

  // ---------------------------------------------------------------------------
  // User validation handlers
  // ---------------------------------------------------------------------------

  // check if a user is valid
  async validate() {
    if (this.callbackPaths.includes(window.location.pathname)) {
      return;
    }

    this.checkAppVersion();

    if (!this.isLoggedIn) {
      return;
    }

    await this.checkExpiration();
    // api.contentLoaded()
    return true;
  }

  // check if the auth token is valid
  async checkExpiration() {
    let { exp } = this.getUserInfo();
    if (!exp) {
      return;
    }

    exp = new Date(exp);

    // if authToken expired relogin the user
    if (exp < new Date()) {
      this.reSignIn();
    }
  }

  // check if the there is a new commit to main
  checkAppVersion() {
    try {
      const latestSHA = env.gitSHA;
      if (!latestSHA) {
        console.warn(`Couldn't get latest git SHA for FrontEnd.`);
        return;
      }

      const localSHA = accountStorage.latestCommitSHA;
      if (!localSHA || localSHA !== latestSHA) {
        if (this.isLoggedIn) {
          this.signOut();
        } else {
          accountStorage.setLatestCommitSHA(latestSHA);
          window.location.reload(true);
        }
      }
    } catch (error) {
      console.error("Failed to checking the latest commit's SHA on main.");
    }
  }

  // ---------------------------------------------------------------------------
  // User info handlers
  // ---------------------------------------------------------------------------

  /**
   * Function used to save user info to localStorage
   */
  saveUserInfo(userInfo, profile, authMethod) {
    // info from CT backend
    const { userId, emailId, universityId } = userInfo;

    // info from token
    const tokenInfo = decoder(userInfo.authToken);
    const exp = new Date(tokenInfo.exp * 1000); // expiration date
    const roles = tokenInfo[TOKEN_INFO_ROLES];

    let lastName = tokenInfo[TOKEN_INFO_FAMILY_NAME] || '';
    let firstName = tokenInfo[TOKEN_INFO_GIVEN_NAME] || '';
    if (!lastName && !firstName) {
      lastName = emailId;
    }

    const fullName = _.trim(`${firstName} ${lastName}`);

    // info from auth0
    let picture = null;
    if (profile) picture = profile.picture;

    // store userInfo in localStorage
    let userInfoStr = JSON.stringify({
      exp,
      roles,
      firstName,
      lastName,
      fullName,
      userId,
      emailId,
      picture,
      authMethod,
      universityId,
    });

    accountStorage.setUserInfo(userInfoStr);
  }

  /**
   * @param {Object} options - options for getting user info
   * @param {Boolean} options.allowLoginAsOverride
   *  - true if allow the user info be overrided by the test user
   * @returns {{
   * firstName:string,
   * lastName:string,
   * fullName:string,
   * picture:string,
   * roles:string[],
   * exp:number,
   * userId:string,
   * emailId:string,
   * universityId:string,
   * authToken:string,
   * authMethod:string,
   * metadata:Object
   * }} userInfo
   */
  getUserInfo(options = { allowLoginAsOverride: true }) {
    // if allow the user info be overrided by the test user
    if (options.allowLoginAsOverride && this.isLoginAsAccount) {
      return accountStorage.loginAsUserInfo;
    }

    return accountStorage.userInfo;
  }

  // return the authorization token
  get authToken() {
    if (uurl.isEqual(links.admin())) {
      // if it's in admin page
      return accountStorage.authToken;
    }

    return this.getLoginAsUserInfo().authToken || accountStorage.authToken;
  }

  // ---------------------------------------------------------------------------
  // Admin - Login as another account - handlers
  // ---------------------------------------------------------------------------

  // return true if an admin is logged in as another account
  get isLoginAsAccount() {
    return Boolean(this.getLoginAsUserInfo().emailId);
  }

  // return the testing user info if an admin is logged in as another account
  getLoginAsUserInfo() {
    return accountStorage.loginAsUserInfo;
  }

  // for admin to sign in as another account
  async loginAsAccountSignIn(emailId) {
    try {
      const { data } = await Account.loginAsAccountSignIn(emailId);
      accountStorage.setLoginAsUserInfo(data);
      window.location.reload();
    } catch (error) {
      prompt.addOne({
        text: `Failed to sign in as ${emailId}`,
        status: 'error',
      });
    }
  }

  // logout the testing account for admin
  loginAsAccountSignOut() {
    accountStorage.remove(accountStorage.LOGIN_AS_USER_INFO_KEY);
    window.location.reload();
  }

  execCloseAfterSignIn() {
    if (accountStorage.closeAfterSignedIn) {
      accountStorage.rmCloseAfterSignedIn();
      window.close();
    }
  }
}
