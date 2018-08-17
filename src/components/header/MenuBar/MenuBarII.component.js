/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withWindowWidthListener } from '../../ResponsiveComponent/ResponsiveComponent';

/*
Local CSS
*/
import './MenuBarII.component.css';
import qchain_logo from '../../../assets/images/logo_option1.png';


/*
Actions
*/
import { setMode, setCurrency } from '../../../actions/HeaderActions';

/*
Children Components
*/
import InAppNavBarII from '../InAppNavBar/InAppNavBarII.component';
import ProfileAccessor from './ProfileAccessor/ProfileAccessor.component';
import BottomNavOnSmScreen from '../InAppNavBar/BottomNavOnSmScreen.component';
import TinyWallet from './TinyWallet/TinyWallet.component';



/**
 * The bar that is at the very top of each component
 * Has a selection of actions that are not navigation, hence called menu
 *
 * -Caution: When changing css, be aware of the signout part that might extend to next line
 * --------- causing blockage to InAppNavBar.
 */
class MenuBarII extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        const { logout } = this.props.auth;
        logout();
    }

    componentWillMount() {
        if (this.props.profile.name === 'User Name') {
            const { handleProfileOnAuthenticated, getAccessToken } = this.props.auth;
            handleProfileOnAuthenticated(getAccessToken());
        }
    }

    render() {

        return (
            <div className='menu-container'>
                <a href='/dashboard' className='logo-redirect'>
                    <img src={qchain_logo} style={{width: '135px'}} className='logo_img' alt='logo' />
                </a>
                <InAppNavBarII {...this.props}/>
                <div className='menu-flex-for-profile-accessor'>
                    <ProfileAccessor profile={this.props.profile} onLogout={this.handleLogout}/>
                </div>
                <TinyWallet {...this.props} />
                <BottomNavOnSmScreen {...this.props}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        modeFilter: state.MenuBarFilterReducer.modeFilter,
        currencyFilter: state.MenuBarFilterReducer.currencyFilter,
        profile: state.ProfileReducer.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onModeClick: (mode) => {
            dispatch(setMode(mode))
        },
        onCurrencyClick: (currency) => {
            dispatch(setCurrency(currency))
        }
    }
}


export default withWindowWidthListener(withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBarII)));
