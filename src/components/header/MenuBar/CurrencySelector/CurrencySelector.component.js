/*
Core Libs
*/
import React from 'react';

/*
Local CSS
*/
import './CurrencySelector.component.css';
import eth_logo    from '../../../../assets/images/Ethereum_logo.png';
import nem_logo    from '../../../../assets/images/NEM_logo.png';

/*
React Bootstrap
*/
import { ButtonGroup, Button } from 'react-bootstrap';


const CurrencySelector = ({ currencyFilter, onClick }) => (
    
        <ButtonGroup bsSize='large' className='currency-selector'>
            <Button
                active={currencyFilter === 'EQC'}
                onClick={() => onClick('EQC')}
            >
                <img src={eth_logo} className='currency-logo' alt='eth-logo' />EQC
            </Button>
            <Button
                active={currencyFilter === 'XQC'}
                onClick={() => onClick('XQC')}
            >
                <img src={nem_logo} className='currency-logo' alt='nem-logo' />XQC
            </Button>
        </ButtonGroup>
    
)


export default CurrencySelector;