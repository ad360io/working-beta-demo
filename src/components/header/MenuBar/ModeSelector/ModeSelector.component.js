/*
Core Libs
*/
import React from 'react';

/*
Local CSS
*/
import './ModeSelector.component.css';

/*
React Bootstrap Component
*/
import { DropdownButton, MenuItem } from 'react-bootstrap'; 


const ModeSelector = ({ modeFilter, onClick }) => (
    <DropdownButton id='mode-selector' bsSize='large' className='mode-selector' title={modeFilter}>
        <MenuItem onClick={() => onClick('Advertiser')} className="mode-item">
            Advertiser
        </MenuItem>
        <MenuItem onClick={() => onClick('Publisher')} className="mode-item">
            Publisher
        </MenuItem>
    </DropdownButton>
)


export default ModeSelector;