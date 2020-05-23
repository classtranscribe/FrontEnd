/**
 * The object for setting up user (get token & userId)
 *  and get user information
 */

import _ from 'lodash';
import decoder from 'jwt-decode';
import * as account from '../cthttp/requests/account';
import { getLatestGitCommitSHA } from '../cthttp/requests/general';
import { env } from '../env';
import { links } from '../links';
import { prompt } from '../prompt';

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
    this.checkGitUpdates = this.checkGitUpdates.bind(this);
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
    if (links.isEqual(links.admin())) {
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
    },
  ) {
    const { method } = options;

    if (env.dev && method === AUTH_TEST) {
      this.testSignIn();
    } else if (method === AUTH_CILOGON) {
      this.ciLogonSignIn();
    } else {
      this.auth0SignIn();
    }
  }

  auth0SignIn() {
    this.auth0Client.signIn();
  }

  ciLogonSignIn() {
    this.ciLogonClient.authorize();
  }

  async testSignIn() {
    const { data } = await account.testSignIn();
    const { authToken } = data;
    // Save AuthToken
    accountStorage.setAuthToken(authToken);
    // Save user info
    this.saveUserInfo(data, {}, AUTH_TEST);
    window.location.reload();
  }

  reSignIn() {
    const { authMethod } = this.getUserInfo({ allowLoginAsOverride: false });
    localStorage.clear();
    this.signIn({ method: authMethod });
  }

  // ---------------------------------------------------------------------------
  // Sign out
  // ---------------------------------------------------------------------------

  signOut() {
    if (!this.isLoggedIn) return;
    localStorage.clear();

    const { authMethod } = this.getUserInfo();
    switch (authMethod) {
      case AUTH_TEST:
        this.testSignOut();
        break;
      case AUTH_CILOGON:
        this.ciLogonSignOut();
        break;
      default:
        this.auth0SignOut();
    }
  }

  auth0SignOut() {
    this.auth0Client.signOut();
  }

  ciLogonSignOut() {
    window.location = window.location.origin;
  }

  testSignOut() {
    window.location = window.location.origin;
  }

  // ---------------------------------------------------------------------------
  // Setup user
  // ---------------------------------------------------------------------------

  async setupUser(token, profile, method, callbackURL) {
    try {
      const fullCallbackURL = window.location.origin + callbackURL;
      const { data } = await account.accountSignIn(token, method, fullCallbackURL);
      // Save AuthToken
      accountStorage.setAuthToken(data.authToken);
      // Save userInfo
      this.saveUserInfo(data, profile, method);

      return true;
    } catch (error) {
      console.error('Failed to get user data and auth token from backend', error);
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

    await this.checkGitUpdates();

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

  // check if the there is a new commit to master
  async checkGitUpdates() {
    try {
      const latestSHA = await getLatestGitCommitSHA();
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
      console.error("Failed to checking the latest commit's SHA on master.");
    }
  }

  // ---------------------------------------------------------------------------
  // User info handlers
  // ---------------------------------------------------------------------------

  /**
   * Function used to save user info to localStorage
   */
  saveUserInfo(userInfo, profile, authMethod) {
    // info from token
    const tokenInfo = decoder(userInfo.authToken);
    const exp = new Date(tokenInfo.exp * 1000); // expiration date
    const roles = tokenInfo[TOKEN_INFO_ROLES];
    const lastName = tokenInfo[TOKEN_INFO_FAMILY_NAME] || 'Test';
    const firstName = tokenInfo[TOKEN_INFO_GIVEN_NAME] || 'User';
    const fullName = `${firstName} ${lastName}`;

    // info from auth0
    const { picture } = profile;

    // info from CT backend
    const { userId, emailId, universityId } = userInfo;

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
    if (links.isEqual(links.admin())) {
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
      const { data } = await account.loginAsAccountSignIn(emailId);
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
}
