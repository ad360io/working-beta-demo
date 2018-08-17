/*
Core Libs
*/
import React from 'react';
import { connect } from 'react-redux';

/*
Local CSS
*/
import './CurrencySelector.component.css';

/*
React Bootstrap
*/
import { ButtonGroup, Button } from 'react-bootstrap';
import { setCurrency } from '../../../../actions/HeaderActions';


const CurrencySelector = ({ currencyFilter, onClick }) => (
    
        <ButtonGroup bsSize='small' className='currency-selector'>
            <Button
                active={currencyFilter === 'XQC'}
                onClick={() => onClick('XQC')}
                style={{width: 98}}
            >
                XQC
            </Button>
            <Button
                active={currencyFilter === 'EQC'}
                onClick={() => onClick('EQC')}
                style={{width: 98}}
            >
                EQC
            </Button>
        </ButtonGroup>
    
)

const mapStateToProps = (state) => {
    return {
        currencyFilter: state.MenuBarFilterReducer.currencyFilter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (currency) => {
            dispatch(setCurrency(currency))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CurrencySelector);