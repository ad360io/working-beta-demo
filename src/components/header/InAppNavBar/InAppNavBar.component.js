/*
Core Libs
*/
import React                   from 'react';
import { connect }             from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

/*
Local CSS
*/
import './InAppNavBar.component.css';


/**
 * Navigation bar that is directly under MenuBar component
 * Main purpose is to navigate between main components
 */
const InAppNavBar = ({ modeFilter }) => (
    <div className='navbar-container'>
        <NavLink activeClassName='selected-nav-item' className='in-app-nav-item noselect' to='/dashboard'>
            <i className='fas fa-home fa-lg'></i>
            <span className='nav-label'>Dashboard</span>
        </NavLink>

        <NavLink activeClassName='selected-nav-item' className='in-app-nav-item noselect' to='/marketplace'>
            <i className='fas fa-suitcase fa-lg'></i>
            <span className='nav-label'>Marketplace</span>
        </NavLink>

        <NavLink activeClassName='selected-nav-item' className='in-app-nav-item noselect' to='/create'>
            <i className='fas fa-file-alt fa-lg'></i>
            <DynamicNavLabel modeFilter={modeFilter} />
        </NavLink>

        <NavLink activeClassName='selected-nav-item' className='in-app-nav-item noselect' to='/profile'>
            <i className='fa fa-user fa-lg'></i>
            <span className='nav-label'>Profile</span>
        </NavLink>
    </div>
)

const DynamicNavLabel = ({ modeFilter }) => (
    modeFilter === 'Advertiser'
        ? <span className='nav-label'>Request</span>
        : <span className='nav-label'>Create</span>                
)

const mapStateToProps = (state) => {
    return {
        modeFilter: state.MenuBarFilterReducer.modeFilter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(InAppNavBar));
