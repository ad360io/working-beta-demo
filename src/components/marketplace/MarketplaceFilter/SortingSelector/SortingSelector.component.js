/*
Core Libs
*/
import React, { Component } from 'react';

/*
React Bootstrap
*/
import { DropdownButton, MenuItem } from 'react-bootstrap';

/*
Local CSS
*/
import './SortingSelector.component.css';


class SortingSelector extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: 'Price (Low - High)'
        }

        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick(value) {
        this.setState({ title : value})
    }

    render () {
        return <div>
        <DropdownButton
            className='sorting-selector-btn'
            title={this.state.title}
            id='sorting-selector-btn'
        >
            <MenuItem onClick={() => this.handleItemClick('Price (Low - High)')}>Price (Low - High)</MenuItem>
            <MenuItem onClick={() => this.handleItemClick('Price (High - Low)')}>Price (High - Low)</MenuItem>
            <MenuItem onClick={() => this.handleItemClick('Relevance')}>Relevance</MenuItem>
        </DropdownButton>
    </div>
    }
}


export default SortingSelector;