/*
Core Libs
*/
import React from 'react';

/*
Local CSS
*/
import './Footer.component.css';


/**
 * Simple footer for Qchain
 */
const Footer = () =>
    <div className='footer-container'>
        <footer className='footer' >
            <div className='footer-content-container'>
                <p>Copyright &copy; 2017 Qchain Co.</p>
                <p>Irvine, CA</p>
                <p><a href='mailto:team@qchain.co'>team@qchain.co</a></p>
                <p><a href='https://qchain.co/privacy'>Privacy Policy</a></p>
            </div>
        </footer>
    </div>


export default Footer;
