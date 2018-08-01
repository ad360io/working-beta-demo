/*
Core Libs
*/
import React, { Component } from 'react';
import { connect }          from 'react-redux';

/*
Local CSS
*/
import './MenuBar.component.css';
import qchain_logo from '../../../assets/images/Qchain_logo.png';

/*
React-Bootstrap Components
*/
import { Navbar, Nav, NavItem }        from 'react-bootstrap';

/*
Actions
*/
import { setMode, setCurrency } from '../../../actions/HeaderActions';

/*
Children Components
*/
import CurrencySelector from './CurrencySelector/CurrencySelector.component';
import ModeSelector from './ModeSelector/ModeSelector.component';


/**
 * The bar that is at the very top of each component
 * Has a selection of actions that are not navigation, hence called menu
 *
 * -Caution: When changing css, be aware of the signout part that might extend to next line
 * --------- causing blockage to InAppNavBar.
 */
class MenuBar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        const { logout } = this.props.auth;
        logout();
    }

    componentWillMount() {
        if(this.props.profile.name === 'User Name'){
            const { handleProfileOnAuthenticated, getAccessToken } = this.props.auth;
            handleProfileOnAuthenticated(getAccessToken());
        }
    }

    render() {

        return (
            <div>
            <Navbar collapseOnSelect fixedTop className='menu-container'>

                {/*Start of Logo section */}
                <Navbar.Header className='menu-header'>
                    <Navbar.Brand>
                        <a href='/dashboard' className='logo-redirect'>
                            <img src={qchain_logo} className='logo_img' alt='logo'/>
                        </a>
                    </Navbar.Brand>
                    <Navbar.Toggle className='burger-button'/>
                </Navbar.Header>
                {/* End of Logo section */}

                <Navbar.Collapse> {/* Any children inside Collapse will be stored in hamburger menu on small screen */}

                    <CurrencySelector 
                        currencyFilter={this.props.currencyFilter} 
                        onClick={this.props.onCurrencyClick} 
                    />

                    <ModeSelector
                        modeFilter={this.props.modeFilter}
                        onClick={this.props.onModeClick}
                    />

                    {/* Start of Sign Out section */}
                    <Nav pullRight className='logout-container'>
                        <NavItem className='logout-label' onClick={this.handleLogout} href='/'>
                            <div className='menu-user-action'>
                                <i className='fas fa-sign-out-alt'></i>Sign Out
                            </div>
                        </NavItem>
                    </Nav>
                    {/* End of Sign Out section */}

                </Navbar.Collapse>

            </Navbar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        modeFilter    : state.MenuBarFilterReducer.modeFilter,
        currencyFilter: state.MenuBarFilterReducer.currencyFilter,
        profile       : state.ProfileReducer.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onModeClick: (mode)=>{
            dispatch(setMode(mode))
        },
        onCurrencyClick: (currency) => {
            dispatch(setCurrency(currency))
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);
