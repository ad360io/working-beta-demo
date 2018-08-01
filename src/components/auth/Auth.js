/*
Auth0 Libs
*/
import { Auth0Config } from './auth0-config';
import auth0 from 'auth0-js';


export default class Auth {

    constructor(store){
        this.store = store;
        this.login = this.login.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.setSession = this.setSession.bind(this);
        this.logout = this.logout.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.renewToken = this.renewToken.bind(this);
        this.scheduleRenewal = this.scheduleRenewal.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.handleProfileOnAuthenticated = this.handleProfileOnAuthenticated.bind(this);
        this.dispatchProfile = this.dispatchProfile.bind(this);
        this.updateUserMetadata = this.updateUserMetadata.bind(this);

        this.scheduleRenewal();
    }

    tokenRenewalTimeout;
    userProfile;

    auth0 = new auth0.WebAuth({
        domain: `${Auth0Config.domain}`,
        clientID: `${Auth0Config.clientID}`,
        redirectUri: `${window.location.protocol}//${window.location.host}/auth-callback`,
        responseType: 'token',
        scope: 'openid email profile role'
    });

    login() {
        this.auth0.authorize();
    }

    handleAuthentication(propsHistory) {
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult, propsHistory);
          } else if (err) {
            propsHistory.push('/');
            console.log(err);
          }
        });
      }

    setSession(authResult, propsHistory) {
        // Set the time that the Access Token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        console.log(authResult.idTokenPayload);
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('user_id', authResult.idTokenPayload.sub);
        localStorage.setItem('role', authResult.idTokenPayload.app_metadata.role);
        this.handleProfileOnAuthenticated(authResult.accessToken);
        this.store.dispatch({
            type: 'SET_ID_TOKEN',
            value: authResult.idToken
        })
        propsHistory.replace('/dashboard');
        propsHistory.push('/dashboard')
        this.scheduleRenewal();
    }

    logout() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('role');
        window.location.reload();
        clearTimeout(this.tokenRenewalTimeout);
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    renewToken() {
        this.auth0.checkSession({}, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              this.setSession(result);
            }
          }
        );
    }

    scheduleRenewal() {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        const delay = expiresAt - Date.now();
        if (delay > 0) {
          this.tokenRenewalTimeout = setTimeout(() => {
            this.renewToken();
          }, delay);
        }
    }

    getAccessToken() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No Access Token found');
        }
        return accessToken;
    }

    getProfile(cb) {
        let accessToken = this.getAccessToken();
        this.auth0.client.userInfo(accessToken, (err, profile) => {
          if (profile) {
            this.userProfile = profile;
          }
          cb(err, profile);
        });
    }

    handleProfileOnAuthenticated(accessToken){
        this.getProfile((err, profile)=>{
            if(profile) {
                this.dispatchProfile(profile,
                    profile['https://auth.qchain.co/user_metadata']
                );
            }
            if(err) console.log(err)
        })
    }

    dispatchProfile(profile, user_metadata) {
        if(typeof user_metadata === 'undefined'){
            let value = {
                name: profile.name,
                email: profile.email,
                nickname: profile.nickname,
                avatar_url: profile.picture
            }
            this.store.dispatch({
                type: 'SET_PROFILE',
                value
            })
        }else{
            let name        = user_metadata.name;
            let email       = (typeof user_metadata.email === 'undefined' || user_metadata.email === ''
                            ? profile.email
                            : user_metadata.email);
            let nickname    = (typeof user_metadata.nickname === 'undefined' || user_metadata.nickname === ''
                            ? profile.nickname
                            : user_metadata.nickname);
            let avatar_url  = (typeof user_metadata.picture === 'undefined'  || user_metadata.picture === ''
                            ? profile.picture
                            : user_metadata.picture);
            let value = {
                name,
                email,
                nickname,
                avatar_url
            }
            this.store.dispatch({
                type: 'SET_PROFILE',
                value
            })
        }
        
    }

    updateUserMetadata(newMetadata){
        let myIdToken = localStorage.getItem('id_token');
        let auth0Manager = new auth0.Management({
            domain: `${Auth0Config.domain}`,
            token: myIdToken,
            _sendTelemetry: false,
        })
        let myUserId = localStorage.getItem('user_id');
        auth0Manager.patchUserMetadata(
            myUserId,
            newMetadata,
            (err, newProfile) => {
                if(err) {
                    console.log(err);
                }
                else {
                    this.logout();
                }
            }
        )
    }

}
