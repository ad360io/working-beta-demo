/*
Core Libs
*/
import React from 'react';

/*
Material UI Components
*/
import CircularProgress from 'material-ui/CircularProgress';

/*
Local CSS
*/
import './AuthCallback.css';


const AuthCallback = () => (
    <div className="auth-callback-container"> 
        <CircularProgress size={60} thickness={7} style={{margin: 'auto'}} />
    </div>
) 

export default AuthCallback;
