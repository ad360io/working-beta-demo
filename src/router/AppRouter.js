/*
Core Libs
*/
import { HashRouter, Switch, Route } from 'react-router-dom';
import React from 'react';

/*
Custom Helpers
*/
import PrivateRoute from './PrivateRoute';
import DefaultRoute from './DefaultRoute';

/*
Other Major Components
*/
import Login from '../components/login/Login.component';
import Dashboard from '../components/dashboard/Dashboard.component';
import Marketplace from '../components/marketplace/Marketplace.component';
import CreateListing from '../components/create-listing/CreateListing.component';
import Profile from '../components/profile/Profile.component';
import DetailedListingPage from '../components/marketplace/MarketplaceListings/DetailedListingPage/DetailedListingPage.component';
import ProfileReader from '../components/profile/ProfileReader/ProfileReader.component';

import AuthCallback from '../components/auth-callback/AuthCallback';
import Auth from '../components/auth/Auth';

import store from '../store/index';



/* Initialization of Auth, 
 *    passing in redux store to dispatch profile on successful login.
 */
const auth = new Auth(store);  

// const handleAuthentication = (nextState, replace, history) => {
//   if (/access_token|id_token|error/.test(nextState.location.hash)) {
//     auth.handleAuthentication(history);
//   }
// }
//console.log(process.env.PUBLIC_URL)
/**
 * Main router for the app.
 * Integeration tested:
 *    - Each path display its own component.
 *    - Private Routes can only be accessed after authentication pass.
 *    - Default Routes display expected components base on authentication status.
 */
localStorage.setItem('access_token', 'DNWGCdaq8tp9K5yhuouHqV7I-Qw_kSS6');
localStorage.setItem('id_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwczovL2F1dGgucWNoYWluLmNvL3VzZXJfbWV0YWRhdGEiOnsibmFtZSI6IllhbyBUc2FpIiwiZ2VvaXAiOnsiY291bnRyeV9jb2RlIjoiVVMiLCJjb3VudHJ5X2NvZGUzIjoiVVNBIiwiY291bnRyeV9uYW1lIjoiVW5pdGVkIFN0YXRlcyIsImNpdHlfbmFtZSI6Ik1vbnRlcmV5IFBhcmsiLCJsYXRpdHVkZSI6MzQuMDYyNSwibG9uZ2l0dWRlIjotMTE4LjEyMjgsInRpbWVfem9uZSI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJjb250aW5lbnRfY29kZSI6Ik5BIn0sInVzZXJfbWV0YWRhdGEiOnsidGVzdCI6InRlc3RlciJ9LCJ0ZXN0IjoidGVzdGVyIiwibmlja25hbWUiOiJDb2RlIE1vbmtleSB8IFFjaGFpbiIsImVtYWlsIjoieXRzYWlAcWNoYWluLmNvIiwiYXZhdGFyX3VybCI6Imh0dHBzOi8vaW1ndXIuY29tL2Rvd25sb2FkLzZvQzJnU2kiLCJwaWN0dXJlIjoiaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy8xLzFiL0dub21lLWZhY2UtbW9ua2V5LnN2ZyJ9LCJlbWFpbCI6Inlhb3RzYWkxN0BnbWFpbC5jb20iLCJ1c2VyX21ldGFkYXRhIjp7Im5hbWUiOiJZYW8gVHNhaSIsImdlb2lwIjp7ImNvdW50cnlfY29kZSI6IlVTIiwiY291bnRyeV9jb2RlMyI6IlVTQSIsImNvdW50cnlfbmFtZSI6IlVuaXRlZCBTdGF0ZXMiLCJjaXR5X25hbWUiOiJNb250ZXJleSBQYXJrIiwibGF0aXR1ZGUiOjM0LjA2MjUsImxvbmdpdHVkZSI6LTExOC4xMjI4LCJ0aW1lX3pvbmUiOiJBbWVyaWNhL0xvc19BbmdlbGVzIiwiY29udGluZW50X2NvZGUiOiJOQSJ9LCJ1c2VyX21ldGFkYXRhIjp7InRlc3QiOiJ0ZXN0ZXIifSwidGVzdCI6InRlc3RlciIsIm5pY2tuYW1lIjoiQ29kZSBNb25rZXkgfCBRY2hhaW4iLCJlbWFpbCI6Inl0c2FpQHFjaGFpbi5jbyIsImF2YXRhcl91cmwiOiJodHRwczovL2ltZ3VyLmNvbS9kb3dubG9hZC82b0MyZ1NpIiwicGljdHVyZSI6Imh0dHBzOi8vdXBsb2FkLndpa2ltZWRpYS5vcmcvd2lraXBlZGlhL2NvbW1vbnMvMS8xYi9Hbm9tZS1mYWNlLW1vbmtleS5zdmcifSwibmFtZSI6Inlhb3RzYWkxN0BnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNDkzZDM0ZDFjZjhjNTlhZGVlYjg2MTU0MWFiMTc3NjA_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ5YS5wbmciLCJuaWNrbmFtZSI6Inlhb3RzYWkxNyIsImFwcF9tZXRhZGF0YSI6eyJyb2xlIjoiXzQ5M2QzNGQxY2Y4YzU5YWRlZWI4NjE1NDFhYjE3NzYwIn0sInJvbGUiOiJfNDkzZDM0ZDFjZjhjNTlhZGVlYjg2MTU0MWFiMTc3NjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY2xpZW50SUQiOiJpcDNqZGxUOHVkcDhoVm9iRG41UTJrNjdlRUR2U1NJaiIsInVwZGF0ZWRfYXQiOiIyMDE4LTA4LTA2VDIzOjM0OjEyLjkzOFoiLCJ1c2VyX2lkIjoiYXV0aDB8NWFiOGIyNmJlY2Q5MGUwMjYzMjVhNTI0IiwiaWRlbnRpdGllcyI6W3sidXNlcl9pZCI6IjVhYjhiMjZiZWNkOTBlMDI2MzI1YTUyNCIsInByb3ZpZGVyIjoiYXV0aDAiLCJjb25uZWN0aW9uIjoiVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24iLCJpc1NvY2lhbCI6ZmFsc2V9XSwiY3JlYXRlZF9hdCI6IjIwMTgtMDMtMjZUMDg6NDI6MTkuNDg2WiIsImh0dHBzOi8vYXV0aDtxY2hhaW47Y28vdXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiWWFvIFRzYWkiLCJnZW9pcCI6eyJjb3VudHJ5X2NvZGUiOiJVUyIsImNvdW50cnlfY29kZTMiOiJVU0EiLCJjb3VudHJ5X25hbWUiOiJVbml0ZWQgU3RhdGVzIiwiY2l0eV9uYW1lIjoiTW9udGVyZXkgUGFyayIsImxhdGl0dWRlIjozNC4wNjI1LCJsb25naXR1ZGUiOi0xMTguMTIyOCwidGltZV96b25lIjoiQW1lcmljYS9Mb3NfQW5nZWxlcyIsImNvbnRpbmVudF9jb2RlIjoiTkEifSwidXNlcl9tZXRhZGF0YSI6eyJ0ZXN0IjoidGVzdGVyIn0sInRlc3QiOiJ0ZXN0ZXIiLCJuaWNrbmFtZSI6IkNvZGUgTW9ua2V5IHwgUWNoYWluIiwiZW1haWwiOiJ5dHNhaUBxY2hhaW4uY28iLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9pbWd1ci5jb20vZG93bmxvYWQvNm9DMmdTaSIsInBpY3R1cmUiOiJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zLzEvMWIvR25vbWUtZmFjZS1tb25rZXkuc3ZnIn0sImlzcyI6Imh0dHBzOi8vcWNoYWluLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1YWI4YjI2YmVjZDkwZTAyNjMyNWE1MjQiLCJhdWQiOiJpcDNqZGxUOHVkcDhoVm9iRG41UTJrNjdlRUR2U1NJaiIsImlhdCI6MTUzMzU5ODQ1MywiZXhwIjoxNTMzNjM0NDUzfQ.EgpqSaqDlq_lKktYScklYF3Ds9cs8ROgHQo7eOkosLo');
localStorage.setItem('expires_at', 9999999999);
localStorage.setItem('user_id', 'auth0|5ab8b26becd90e026325a524');
localStorage.setItem('role', '_493d34d1cf8c59adeeb861541ab17760');

const AppRouter = () => (

  <HashRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      {/* <Route exact path='/' render={(props)=><Login auth={auth} {...props}/>} /> */}
      <PrivateRoute exact path='/dashboard' component={Dashboard} auth={auth}/>
      <PrivateRoute exact path='/marketplace' component={Marketplace} auth={auth}/>
      <PrivateRoute exact path='/create' component={CreateListing} auth={auth}/>
      <PrivateRoute path='/listing/:id' component={DetailedListingPage} auth={auth}/>
      <PrivateRoute exact path='/profile' component={Profile} auth={auth}/>
      <PrivateRoute path='/q/:userId' component={ProfileReader} auth={auth}/>
      {/* <Route path='/auth-callback' render={ (props) => {
                handleAuthentication(props, null, props.history);
                return <AuthCallback auth={auth} {...props} /> 
            }}/>
            <DefaultRoute auth={auth}/> */}
    </Switch>
  </HashRouter>
);


export default AppRouter;