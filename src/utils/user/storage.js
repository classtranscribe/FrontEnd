class AccountStorage {
  AUTH_TOKEN_KEY = 'authToken';
  USER_INFO_KEY = 'userInfo';
  LOGIN_AS_USER_INFO_KEY = 'loginAsUserInfo';
  LATEST_COMMIT_SHA_KEY = 'latest-sha';
  CLOSE_AFTER_SIGNED_IN_KEY = 'close-after-signed-in';

  remove(key) {
    localStorage.removeItem(key);
  }

  
  setAuthToken(token) {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  /**
   * Auth token
   * @returns {String} Auth token
   */
  get authToken() {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  setUserInfo(userInfo_) {
    let data = userInfo_;
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    localStorage.setItem(this.USER_INFO_KEY, data);
  }

  /**
   * User info
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
  get userInfo() {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : {};
  }
  

  setLoginAsUserInfo(userInfo_) {
    let data = userInfo_;
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    localStorage.setItem(this.LOGIN_AS_USER_INFO_KEY, data);
  }

  get loginAsUserInfo() {
    const userInfoStr = localStorage.getItem(this.LOGIN_AS_USER_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : {};
  }

  setLatestCommitSHA(latestSHA) {
    localStorage.setItem(this.LATEST_COMMIT_SHA_KEY, latestSHA);
  }

  /**
   * Latest Commit SHA for FrontEnd `main`
   */
  get latestCommitSHA() {
    return localStorage.getItem(this.LATEST_COMMIT_SHA_KEY);
  }

  setCloseAfterSignedIn() {
    localStorage.setItem(this.CLOSE_AFTER_SIGNED_IN_KEY, 'true');
  }

  get closeAfterSignedIn() {
    return localStorage.getItem(this.CLOSE_AFTER_SIGNED_IN_KEY) === 'true';
  }

  rmCloseAfterSignedIn() {
    localStorage.removeItem(this.CLOSE_AFTER_SIGNED_IN_KEY);
  }
}

export const accountStorage = new AccountStorage();
