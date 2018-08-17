/*
Core Libs
*/
import React, { Component } from 'react';
import { connect }          from 'react-redux';

/*
Networking
*/
import axios from 'axios';

/*
Material UI
*/
import CircularProgress from 'material-ui/CircularProgress';

/*
Local CSS
*/
import './Marketplace.component.css';

/*
Children Components
*/
import MarketplaceFilter   from './MarketplaceFilter/MarketplaceFilter.component';
import MarketplaceListings from './MarketplaceListings/MarketplaceListings.component';
import ErrorPage           from '../ErrorPage/ErrorPage.component';
import DetailedListingPage from './MarketplaceListings/DetailedListingPage/DetailedListingPage.component';

/*
Actions
*/
import { fetch_MarketplaceData_Fulfilled,
         fetch_MarketplaceData_Pending, 
         fetch_MarketplaceData_Rejected } from '../../actions/DatabaseRequestActions';


/**
 * Marketplace Component
 *      displays accurate listings base on filters
 *      filters set in MarketplaceFilter is sent to Redux state.
 *          Future Task: * Dynamic loading the listing (automate pagination)
 */
class Marketplace extends Component {
    constructor(props) {
        super(props);
        props.onStartLoadData(props.idToken);
    }

    componentDidMount() {
        document.title = "Qchain - Marketplace";

        // Register data loading every 10 minutes.
        const tenMinutes = 1000 * 60 * 10;
        this.loadDataInterval = setInterval(this.props.onStartLoadData, tenMinutes);
    }

    componentWillUnmount() {
        // Tidy up
        clearInterval(this.loadDataInterval);
        this.loadDataInterval = 0;
    }

    render(){
        if(this.props.hasError) {
            return <ErrorPage />
        }else if (this.props.fetched){
            return <div>
                <div className='marketplace-container'> 
                    {
                        this.props.viewingId !== null
                            ? <DetailedListingPage />
                            : <MarketplaceListings />
                    }
                    <MarketplaceFilter />
                    
                </div>
            </div>
        }else{
            return <div className='loading-container'><CircularProgress size={100} thickness={6} style={{marginTop: '40vh'}} /> </div>
        }
    }
    
}

const mapStateToProps = (state) => {
    return {
        fetched        : state.MarketplaceDataReducer.fetched,
        hasError       : state.MarketplaceDataReducer.hasError,
        viewingId      : state.MarketplaceDataReducer.viewingId,
        idToken        : state.ProfileReducer.idToken
    }
}

const mapDispatchToProps = (dispatch) => {
    const TestServerURL = "https://qchain-marketplace-postgrest.herokuapp.com/detailed_listing_view";
    return {
        onStartLoadData: (idToken) => {
            const config = {
                headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
            };
            dispatch((dispatch) => {
                dispatch(fetch_MarketplaceData_Pending())
                axios.get(TestServerURL, config)
                    .then((response) => {
                        dispatch(fetch_MarketplaceData_Fulfilled(response.data))
                    })
                    .catch((err) => {
                        console.log(err)
                        dispatch(fetch_MarketplaceData_Rejected(err))
                    })
            })
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Marketplace);
