/*
Core Libs
*/
import React, { Component } from 'react';

/*
Local CSS and Logo
*/
import './Login.component.css';
import qchain_logo from '../../assets/images/logo_option1.png';


/**
 * Login Component
 */
class Login extends Component {

    componentDidMount() {
        document.title = "Qchain - Login";
    }
    
    onLoginClickHandler = () => {
        this.props.auth.login();
    }

    render(){
        return (
            <div className='cover-login'>
                <div id='loginCard' className='card-login text-center'>
                    <img className='logo' src={ qchain_logo } alt='Qchain' width='350px'/>
                    <br/><br/>

                    <p style={{fontSize: 24+'px'}}>alpha <span style={{fontSize: 20+'px'}}>v0.71</span></p>
                    <br/>

                    <a className='btn btn-primary btn-login' id='btn-login' onClick={this.onLoginClickHandler}>GET STARTED</a>
                </div>
            </div>
        );
    }
}


export default Login;