/*
Core Libs
*/
import React, { Component } from 'react';

/*
Local CSS
*/
import './CreateListing.component.css'

import CreateListingForm from './CreateListingForm/CreateListingForm.component'


/**
 * Create Listing Component
 */
class CreateListing extends Component {

    componentDidMount() {
        document.title = "Qchain - Create"
        window.scrollTo(0,0)
    }

    render() {
        return <div className='create-container'>
            <CreateListingForm />
        </div>
    }
}

export default CreateListing;
