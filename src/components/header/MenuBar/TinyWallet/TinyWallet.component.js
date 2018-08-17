/*
Core Libs
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

/*
Local CSS
*/
import './TinyWallet.component.css'


/**
 * Wallet Component should display accurate balances
 *         Work to be done:
 *              - Pull data on componentsWillMount
 */
class TinyWallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            err: null,
            xqc_balance: '----------',
            eqc_balance: '----------'
        }
    }

    componentWillMount() {
        this.getWalletInfo();
    }

    componentWillReceiveProps() {
        this.getWalletInfo();
    }

    getWalletInfo = () => {
        const walletURL = "https://qchain-marketplace-postgrest.herokuapp.com/wallet_view";
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        axios.get(walletURL, config)
            .then((response) => {
                this.setState({
                    ...this.state,
                    finished: true,
                    xqc_balance: `${response.data[0].xqc_balance} XQC`,
                    eqc_balance: `${response.data[0].eqc_balance} EQC`
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
        return <div className='tiny-wallet-container'>

            <p className='tiny-wallet-title'>CURRENT BALANCE</p>


            {
                (this.props.currencyFilter === 'EQC'
                    ? <WalletEqcRenderer balance={this.state.eqc_balance} />
                    : <WalletXqcRenderer balance={this.state.xqc_balance} />
                )
            }



        </div>
    }
}

const WalletEqcRenderer = ({ balance }) => (
    <p className='tiny-currency-item'>
        <span className='tiny-wallet-currency-label'>{balance} </span>
    </p>
)

const WalletXqcRenderer = ({ balance }) => (
    <p className='tiny-currency-item'>
        <span className='tiny-wallet-currency-label'>{balance} </span>
    </p>
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
)(TinyWallet);
