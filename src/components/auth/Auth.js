/*
Auth0 Libs
*/
import { Auth0Config } from './auth0-config';
import auth0 from 'auth0-js';
import { Redirect } from 'react-router-dom'


export default class Auth {

    constructor(store){
        this.store = store;
        this.history = null;
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
        this.setHistory = this.setHistory.bind(this);

        this.scheduleRenewal();
    }

    tokenRenewalTimeout;
    userProfile;

    setHistory(history) {
        this.history = history;
    }

    auth0 = new auth0.WebAuth({
        domain: `${Auth0Config.domain}`,
        clientID: `${Auth0Config.clientID}`,
        redirectUri: `${window.location.protocol}//${window.location.host}/auth-callback`,
        responseType: 'token',
        scope: 'openid email profile role'
    });

    login() {
        //this.auth0.authorize();
        localStorage.setItem('access_token', 'abc');
        localStorage.setItem('id_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqSXpSVEU1TkRJNFJrRkNOVGRETURCRVJUazFPVEU0TURRNU5FTkZRMEl5T0RWR01VSTVSQSJ9.eyJodHRwczovL2F1dGgucWNoYWluLmNvL3VzZXJfbWV0YWRhdGEiOnsibmFtZSI6IllhbyBUc2FpIiwiZ2VvaXAiOnsiY291bnRyeV9jb2RlIjoiVVMiLCJjb3VudHJ5X2NvZGUzIjoiVVNBIiwiY291bnRyeV9uYW1lIjoiVW5pdGVkIFN0YXRlcyIsImNpdHlfbmFtZSI6Ik1vbnRlcmV5IFBhcmsiLCJsYXRpdHVkZSI6MzQuMDYyNSwibG9uZ2l0dWRlIjotMTE4LjEyMjgsInRpbWVfem9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJjb250aW5lbnRfY29kZSI6Ik5BIn0sInVzZXJfbWV0YWRhdGEiOnsidGVzdCI6InRlc3RlciJ9LCJ0ZXN0IjoidGVzdGVyIiwibmlja25hbWUiOiJDb2RlIE1vbmtleSB8IFFjaGFpbiIsImVtYWlsIjoieXRzYWlAcWNoYWluLmNvIiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vaW1ndXIuY29tL2Rvd25sb2FkLzZvQzJnU2kiLCJwaWN0dXJlIjoiaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy8xLzFiL0dub21lLWZhY2UtbW9ua2V5LnN2ZyJ9LCJlbWFpbCI6Inlhb3RzYWkxN0BnbWFpbC5jb20iLCJ1c2VyX21ldGFkYXRhIjp7Im5hbWUiOiJZYW8gVHNhaSIsImdlb2lwIjp7ImNvdW50cnlfY29kZSI6IlVTIiwiY291bnRyeV9jb2RlMyI6IlVTQSIsImNvdW50cnlfbmFtZSI6IlVuaXRlZCBTdGF0ZXMiLCJjaXR5X25hbWUiOiJNb250ZXJleSBQYXJrIiwibGF0aXR1ZGUiOjM0LjA2MjUsImxvbmdpdHVkZSI6LTExOC4xMjI4LCJ0aW1lX3pvbmUiOiJBbWVyaWNhL0xvc19BbmdlbGVzIiwiY29udGluZW50X2NvZGUiOiJOQSJ9LCJ1c2VyX21ldGFkYXRhIjp7InRlc3QiOiJ0ZXN0ZXIifSwidGVzdCI6InRlc3RlciIsIm5pY2tuYW1lIjoiQ29kZSBNb25rZXkgfCBRY2hhaW4iLCJlbWFpbCI6Inl0c2FpQHFjaGFpbi5jbyIsImF2YXRhcl91cmwiOiJodHRwczovL2ltZ3VyLmNvbS9kb3dubG9hZC82b0MyZ1NpIiwicGljdHVyZSI6Imh0dHBzOi8vdXBsb2FkLndpa2ltZWRpYS5vcmcvd2lraXBlZGlhL2NvbW1vbnMvMS8xYi9Hbm9tZS1mYWNlLW1vbmtleS5zdmcifSwibmFtZSI6Inlhb3RzYWkxN0BnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNDkzZDM0ZDFjZjhjNTlhZGVlYjg2MTU0MWFiMTc3NjA_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ5YS5wbmciLCJuaWNrbmFtZSI6Inlhb3RzYWkxNyIsImFwcF9tZXRhZGF0YSI6eyJyb2xlIjoiX2IyNTEzYzNjYWUxM2RkNDVmMzkyYjVmM2VkYjhkMTVkIn0sInJvbGUiOiJfYjI1MTNjM2NhZTEzZGQ0NWYzOTJiNWYzZWRiOGQxNWQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY2xpZW50SUQiOiJpcDNqZGxUOHVkcDhoVm9iRG41UTJrNjdlRUR2U1NJaiIsInVwZGF0ZWRfYXQiOiIyMDE4LTA3LTMxVDA4OjQ0OjM2LjQ5OFoiLCJ1c2VyX2lkIjoiYXV0aDB8NWFiOGIyNmJlY2Q5MGUwMjYzMjVhNTI0IiwiaWRlbnRpdGllcyI6W3sidXNlcl9pZCI6IjVhYjhiMjZiZWNkOTBlMDI2MzI1YTUyNCIsInByb3ZpZGVyIjoiYXV0aDAiLCJjb25uZWN0aW9uIjoiVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24iLCJpc1NvY2lhbCI6ZmFsc2V9XSwiY3JlYXRlZF9hdCI6IjIwMTgtMDMtMjZUMDg6NDI6MTkuNDg2WiIsImh0dHBzOi8vYXV0aDtxY2hhaW47Y28vdXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiWWFvIFRzYWkiLCJnZW9pcCI6eyJjb3VudHJ5X2NvZGUiOiJVUyIsImNvdW50cnlfY29kZTMiOiJVU0EiLCJjb3VudHJ5X25hbWUiOiJVbml0ZWQgU3RhdGVzIiwiY2l0eV9uYW1lIjoiTW9udGVyZXkgUGFyayIsImxhdGl0dWRlIjozNC4wNjI1LCJsb25naXR1ZGUiOi0xMTguMTIyOCwidGltZV96b25lIjoiQW1lcmljYS9Mb3NfQW5nZWxlcyIsImNvbnRpbmVudF9jb2RlIjoiTkEifSwidXNlcl9tZXRhZGF0YSI6eyJ0ZXN0IjoidGVzdGVyIn0sInRlc3QiOiJ0ZXN0ZXIiLCJuaWNrbmFtZSI6IkNvZGUgTW9ua2V5IHwgUWNoYWluIiwiZW1haWwiOiJ5dHNhaUBxY2hhaW4uY28iLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9pbWd1ci5jb20vZG93bmxvYWQvNm9DMmdTaSIsInBpY3R1cmUiOiJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zLzEvMWIvR25vbWUtZmFjZS1tb25rZXkuc3ZnIn0sImlzcyI6Imh0dHBzOi8vcWNoYWluLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1YWI4YjI2YmVjZDkwZTAyNjMyNWE1MjQiLCJhdWQiOiJpcDNqZGxUOHVkcDhoVm9iRG41UTJrNjdlRUR2U1NJaiIsImlhdCI6MTUzMzAyNjY3NiwiZXhwIjoxNTMzMDYyNjc2fQ.4aMkL3h2tkktOCITKdCTd_ckoC3SZ_PxoM_ypIvnwo4LDholia8qdteKp5NUZvptI3fnTErGZOt01INzSppF6cp_CBoQzmNOQbGCk4G2sC5izUL3fkhKOSkSQW6HyO-UsE5QprC_OlBbLSG1GjarPOOpYTKU1LZEXhsj2hLNe3hSiSa_L7aVnpKMf6iBM7ztXJ-MsAMWjnuJvdqKCG44Myk4iFRpPuZ0jMmciA06rWgBIyj7I_VoKdVQeLmx2fCKdmvAdA8mCmN-Z3-IWbmdO3QrI73y85ZkzoEPN6tnJbCj5knK4-Ae1SV1TNOfbWdudA9TNqbjDV7j--QWrNCkCA');
        localStorage.setItem('expires_at', 9999999999999999);
        localStorage.setItem('role', '_0411165a713434916363dca5a826430');
        this.history.replace('/dashboard');
        this.history.push('/dashboard')
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
        // localStorage.setItem('access_token', authResult.accessToken);
        // localStorage.setItem('id_token', authResult.idToken);
        // localStorage.setItem('expires_at', expiresAt);
        // localStorage.setItem('user_id', authResult.idTokenPayload.sub);
        // localStorage.setItem('role', authResult.idTokenPayload.app_metadata.role);
        this.handleProfileOnAuthenticated(authResult.accessToken);
        // this.store.dispatch({
        //     type: 'SET_ID_TOKEN',
        //     value: authResult.idToken
        // })
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
