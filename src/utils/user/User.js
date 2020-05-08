/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 */

import _ from 'lodash';
import decoder from 'jwt-decode';
import { api } from '../cthttp';
import { env } from '../env';
import { links } from '../links';
import { prompt } from '../prompt';
import { Auth0 } from './Auth0';

import {
    TOKEN_INFO_KEY,
    USER_INFO_KEY,
    AUTH_TOKEN_KEY,
    TEST_USER_INFO_KEY,
    LATEST_COMMIT_SHA_KEY,
    ROLE_ADMIN,
    ROLE_INST,
    // auth methods
    AUTH_AUTH0,
    AUTH_CILOGON,
    AUTH_TEST,
} from './constants';


export class User {
    constructor() {
        this.auth0Client = new Auth0();

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
        TEST: AUTH_TEST
    };

    callbackPaths = [
        links.signin(),
        links.auth0Callback(),
        links.ciLogonCallback()
    ];

    /** return true if the user is logged in */
    get isLoggedIn() {
        return Boolean(this.userId);
    }

    /** return true if the user is an admin */
    get isAdmin() {
        let roles = this.getUserInfo({ allowLoginAsOverride: false }).roles || [];
        return _.includes(roles, ROLE_ADMIN);
    }

    /** return true if the user is an instructor */
    get isInstructor() {
        let roles = this.getUserInfo({ allowLoginAsOverride: false }).roles || [];
        return _.includes(roles, ROLE_INST);
    }

    /** returns the id of the user, or test id if it exists */
    get userId() {
        if (links.isEqual(links.admin())) { // if it's in admin page
            return this.getUserInfo().userId;
        }

        return this.getLoginAsUserInfo().userId || this.getUserInfo().userId;
    }


    // ---------------------------------------------------------------------------
    // Sign in
    // ---------------------------------------------------------------------------

    signIn(options={ 
        method: AUTH_AUTH0 
    }) {
        let { method } = options;

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
        
    }

    async testSignIn() {
        let { data } = await api.testSignIn();
        let { authToken } = data;
        // Save AuthToken
        this.authToken = authToken;
        // Save user info
        this.saveUserInfo(data, {}, AUTH_TEST);
        window.location.reload();
    }

    // login the user and clear the localStorage
    reSignIn() {
        localStorage.clear();
        this.signIn();
    }

    // ---------------------------------------------------------------------------
    // Sign out
    // ---------------------------------------------------------------------------

    signOut () {
        localStorage.clear();

        let { authMethod } = this.getUserInfo();
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
        
    }

    testSignOut() {
        window.location = window.location.origin;
    }


    // ---------------------------------------------------------------------------
    // Setup user
    // ---------------------------------------------------------------------------

    async setupUser(token, profile, method) {
        try {
            const { data } = await api.accountSignIn(token, method);
            // Save AuthToken
            this.authToken = data.authToken;
            // Save userInfo
            this.saveUserInfo(data, profile, method);

            return true;
        } catch (error) {
            console.error('Failed to get user data and auth token from backend', error);
        }

        return false;
    }

    redirect(redirectURL) {
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
        if (!this.isLoggedIn) {
            // load user info and `id_token` from Auth0
            try {
                await this.auth0Client.handleAuthentication();
            } catch (error) {
                console.error('Failed to parse Auth0 id_token', error);
                return;
            }
            
            // get authToken from backend using auth0's `id_token`
            let id_token = this.auth0Client.getAuth0Token();
            let profile = this.auth0Client.getProfile();
            let successed = await this.setupUser(id_token, profile, AUTH_AUTH0);
            if (!successed) {
                return;
            }

            // start redirecting
            let redirectURL = this.auth0Client.getRedirectURL(); // default redirect url
            this.redirect(redirectURL);
        } else {
            window.location = this.auth0Client.getRedirectURL();
        }
    }


    // ---------------------------------------------------------------------------
    // User validation handlers
    // ---------------------------------------------------------------------------

    // check if a user is valid
    async validate() {
        if (links.isEqual(links.signin())) return;
        if (links.isEqual(links.logout())) return;
        await this.checkGitUpdates();
        if (!this.isLoggedIn) return;
        await this.checkExpiration();
        // api.contentLoaded()
        return true;
    }

    // check if the auth token is valid
    async checkExpiration() {
        let { exp } = this.getUserInfo();
        if (!Boolean(exp)) return;

        exp = new Date(exp);

        // if authToken expired relogin the user
        if (exp < new Date()) {
            this.reSignIn();
        }
    }

    // check if the there is a new commit to master
    async checkGitUpdates() {
        try {
            let latestSHA = await api.getLatestGitCommitSHA();
            let localSHA = localStorage.getItem(LATEST_COMMIT_SHA_KEY);
            // console.log(localSHA, latestSHA, localSHA === latestSHA)
            // if it's a first time user, store the latest commit SHA
            if (!localSHA && !this.isLoggedIn) {
                localStorage.setItem(LATEST_COMMIT_SHA_KEY, latestSHA);
                window.location.reload(true);
            }
            // if there is a new commit, forcely reload the page from server
            else if (!localSHA || localSHA !== latestSHA) {
                localStorage.setItem(LATEST_COMMIT_SHA_KEY, latestSHA);
                window.location.reload(true);
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
        // info from JWT token
        const tokenInfo = decoder(userInfo.authToken);
        let { iss } = tokenInfo;
        let exp = new Date(tokenInfo.exp * 1000); // expiration date
        // info from auth0
        const {
            name,
            given_name,
            family_name,
            picture,
        } = profile;

        // info from CT backend
        let {
            userId,
            emailId,
            universityId 
        } = userInfo;

        // store userInfo in localStorage
        localStorage.setItem(USER_INFO_KEY, JSON.stringify({
            exp,
            iss,
            userId,
            emailId,
            picture,
            authMethod,
            universityId,
            roles: tokenInfo[TOKEN_INFO_KEY],
            firstName: given_name || emailId,
            lastName: family_name,
            fullName: name || emailId,
        }));
    }

    /**
     * @param {Object} options options for getting user info
     * @param {Boolean} options.allowLoginAsOverride true if allow the user info be overrided by the test user
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
    getUserInfo (options={ allowLoginAsOverride: true }) {
        // if allow the user info be overrided by the test user
        if (options.allowLoginAsOverride && this.isLoginAsAccount) {
            return this.getLoginAsUserInfo();
        }

        let userInfoStr = localStorage.getItem(USER_INFO_KEY);
        // console.log(JSON.parse(userInfoStr))
        return userInfoStr ? JSON.parse(userInfoStr) : {};
    }

    // set the authorization token
    set authToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    // return the authorization token
    get authToken() {
        if (links.isEqual(links.admin())) { // if it's in admin page
            return localStorage.getItem(AUTH_TOKEN_KEY);
        }

        return this.getLoginAsUserInfo().authToken || localStorage.getItem(AUTH_TOKEN_KEY);
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
        let dataStr = localStorage.getItem(TEST_USER_INFO_KEY);
        return dataStr ? JSON.parse(dataStr) : {};
    }

    // for admin to sign in as another account
    async loginAsAccountSignIn(emailId) {
        try {
            const { data } = await api.loginAsAccountSignIn(emailId);
            // console.log(data);
            localStorage.setItem(TEST_USER_INFO_KEY, JSON.stringify(data));
            window.location.reload();
        } catch (error) {
            prompt.addOne({
                text: `Failed to sign in as ${emailId}`, 
                status: 'error'
            });
        }
    }

    // logout the testing account for admin
    loginAsAccountSignOut () {
        localStorage.removeItem(TEST_USER_INFO_KEY);
        window.location.reload();
    }
}