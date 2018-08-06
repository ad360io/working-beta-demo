/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';

/*
Local CSS
*/
import './Dashboard.component.css';

/*
React Bootstrap Components
*/
import { Col, Row, Grid } from 'react-bootstrap';
import { Alert }          from 'react-bootstrap';

/*
Material UI
*/
import CircularProgress from 'material-ui/CircularProgress';

/*
Networking
*/
import axios from 'axios';

/*
Actions
*/
import { fetch_DashboardData_Fulfilled, fetch_DashboardData_Pending, fetch_DashboardData_Rejected } from '../../actions/DatabaseRequestActions';

/*
Custom Components
*/
import Footer          from '../footer/Footer.component';
import DashboardWallet from './DashboardWallet/DashboardWallet.component';
import DashboardStats  from './DashboardStats/DashboardStats.component';
import DashboardCharts from './DashboardCharts/DashboardCharts.component';
import ErrorPage       from '../ErrorPage/ErrorPage.component';
import fakeData        from './DummyData';

/**
 * Dashboard container manages the layout of each children components
 * ! Caution: when changing css, be aware dashboard-right may overlap to left on screen resize
 */
class Dashboard extends Component {

    constructor(props) {
        super(props);
        props.onStartLoadData();
    }

    componentDidMount() {
        document.title = "Qchain - Dashboard";
        window.scrollTo(0,0)
        
        // Register data loading every 10 minutes.
        const tenMinutes = 1000 * 60 * 10;
        this.loadDataInterval = setInterval(this.props.onStartLoadData, tenMinutes);
    }

    componentWillUnmount() {
        // Tidy up
        clearInterval(this.loadDataInterval);
        this.loadDataInterval = 0;
    }

    render() {
        if (this.props.hasError) {
            return <ErrorPage />
        }
        else if (this.props.fetched){
            return <DashboardRenderer
                        modeFilter={this.props.modeFilter}
                        currencyFilter={this.props.currencyFilter}
                    />
        }else {
            return <ProgressRenderer />
        }
    }
}

const DashboardRenderer = ({ modeFilter, currencyFilter }) => (
    <div className='dashboard-container'>
        <Alert className='dashboard-alert' bsStyle='info'>Analytics and data tracking are work in progress, stay tuned.</Alert>
        <Grid className='dashboard-grid'>
            <Row>
                <Col xs={12} lg={5} sm={8} className='dashboard-left'>
                    <DashboardWallet className='wallet-div' />
                    <DashboardStats
                        modeFilter={modeFilter}
                        currencyFilter={currencyFilter}
                        className='stats-div' />
                </Col>

                <Col xs={12} lg={7} sm={4} className='dashboard-right'>
                    <DashboardCharts
                        modeFilter={modeFilter}
                        currencyFilter={currencyFilter} />
                </Col>
            </Row>
        </Grid>
        <Footer />
    </div>
)

const ProgressRenderer = () => (
    <div className="progress-renderer">
        <CircularProgress size={100} thickness={6} />
    </div>
)

const mapStateToProps = (state) => {
    return {
        modeFilter     : state.MenuBarFilterReducer.modeFilter,
        currencyFilter : state.MenuBarFilterReducer.currencyFilter,
        fetched        : state.DashboardDataReducer.fetched,
        hasError       : state.DashboardDataReducer.hasError
    }
}

const mapDispatchToProps = (dispatch) => {
    const TestServerURL = "http://localhost:3000/api/dashboard";
    return {
        onStartLoadData: () => {
            dispatch((dispatch) => {
                //dispatch(fetch_DashboardData_Pending())
                // axios.get(TestServerURL)
                //     .then((response) => {
                //         dispatch(fetch_DashboardData_Fulfilled(response.data))
                //     })
                //     .catch((err) => {
                //         console.log(err)
                //         dispatch(fetch_DashboardData_Rejected(err))
                //     })
                dispatch(fetch_DashboardData_Fulfilled(fakeResponseData))
            })
        }
    }
}

const fakeResponseData = {
    advertiserDailyData: fakeData.advertiserDailyData,
    publisherDailyData : fakeData.publisherDailyData,
    xqcContracts : fakeData.xqcContracts,
    eqcContracts : fakeData.eqcContracts
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
