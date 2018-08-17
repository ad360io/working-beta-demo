/*
Core Libs
*/
import React from 'react';
import { connect } from 'react-redux';

/*
Local CSS
*/
import './ModeSelector.component.css';

/*
React Bootstrap
*/
import { ButtonGroup, Button } from 'react-bootstrap';
import { setMode } from '../../../../actions/HeaderActions';


const ModeSelector = ({ modeFilter, onClick }) => (
    
        <ButtonGroup bsSize='small' className='mode-selector'>
            <Button
                active={modeFilter === 'Advertiser'}
                onClick={() => onClick('Advertiser')}
                style={{width: 98}}
            >
                an advertiser
            </Button>
            <Button
                active={modeFilter === 'Publisher'}
                onClick={() => onClick('Publisher')}
                style={{width: 98}}
            >
                a publisher
            </Button>
        </ButtonGroup>
    
)

const mapStateToProps = (state) => {
    return {
        modeFilter: state.MenuBarFilterReducer.modeFilter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (mode) => {
            dispatch(setMode(mode))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModeSelector);