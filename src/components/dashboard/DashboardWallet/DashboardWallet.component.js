/*
Core Libs
*/
import React, { Component } from 'react';
import { connect }          from 'react-redux';
import axios                from 'axios';

/*
Material UI Components
*/
import { Card, CardText } from 'material-ui/Card';
import Divider            from 'material-ui/Divider';

/*
Image Resources
*/
import eqc_icon from '../../../assets/images/neqc.png';
import xqc_icon from '../../../assets/images/nxqc.png';

/*
Local CSS
*/
import './DashboardWallet.component.css'


/**
 * Wallet Component should display accurate balances
 *         Work to be done:
 *              - Pull data on componentsWillMount
 */
class DashboardWallet extends Component {
    constructor(props){
        super(props);
        this.state ={
            finished: false,
            err: null,
            xqc_balance: '--------------',
            eqc_balance: '--------------'
        }
    }

    componentWillMount() {
        const walletURL = "https://qchain-marketplace-postgrest.herokuapp.com/wallet_view";
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        axios.get(walletURL, config)
                    .then((response) => {
                        this.setState({
                            ...this.state,
                            finished: true,
                            xqc_balance: response.data[0].xqc_balance,
                            eqc_balance: response.data[0].eqc_balance
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({
                            ...this.state,
                            finished: true,
                            err: err
                        })
                    })
    }
    render() {
        return <div className='wallet-container'>
            <Card className='wallet-info-card' style={{marginBottom:'2%'}}>
                <h2 className='wallet-card-title'>Your Balances</h2>
                <Divider style={{marginBottom:'4%'}}/>
                <CardText>
                <ul>
                    {
                        (this.props.currencyFilter === 'EQC' 
                            ? <WalletEqcRenderer balance={this.state.eqc_balance}/>
                            : <WalletXqcRenderer balance={this.state.xqc_balance}/>
                        )
                    }
                </ul>
                </CardText>
            </Card>
        </div>
    }
}

const WalletEqcRenderer = ({balance}) => (
    <li className='currency-item'>
        <img className='eqc-icon' src={eqc_icon} alt='eqc-icon'/>
        <span className='wallet-currency-label'>{balance} EQC </span>
    </li>
)

const WalletXqcRenderer = ({balance}) => (
    <li className='currency-item'>
        <img className='xqc-icon' src={xqc_icon} alt='xqc-icon'/>
        <span className='wallet-currency-label'>{balance} XQC </span>
    </li>
)

const mapStateToProps = (state) => {
    return {
        currencyFilter: state.MenuBarFilterReducer.currencyFilter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardWallet);
