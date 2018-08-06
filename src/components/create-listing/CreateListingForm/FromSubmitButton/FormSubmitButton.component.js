import React, { Component } from 'react';
import { connect }          from 'react-redux';

import axios from 'axios';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Alert } from 'react-bootstrap';

class FormSubmitButton extends Component{
    constructor(props){
        super(props);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.createPayload = this.createPayload.bind(this);
        this.state ={
            posted: false,
            finished: false,
            err: null,
        }
    }
    
    handleSubmitClick() {
        this.props.onSubmit();

        this.setState({
            ...this.state,
            posted: true
        });

        const listingURL = "https://qchain-marketplace-postgrest.herokuapp.com/listing";
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        axios.post(listingURL, this.createPayload(), config)
                    .then(() => {
                        this.setState({
                            ...this.state,
                            finished: true,
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

    createPayload(){
        if(this.props.modeFilter === 'Advertiser'){
            return {
                name: this.props.advertiserForm.topic,
                description: this.props.advertiserForm.description,
                medium: this.props.advertiserForm.medium,
                date_added: new Date().toISOString().slice(0, 10),
                expiration_date: null,
                url: null,
                price: null,
                currency: this.props.currencyFilter,
                ad_format: this.props.advertiserForm.adFormat,
                classtype: "request",
                advertiser: localStorage.getItem('role'),
                publisher: 'none',
                owner: localStorage.getItem('role'),
                isactive: true
            } 
        }else {
            return {
                name: this.props.publisherForm.topic,
                description: this.props.publisherForm.description,
                medium: this.props.publisherForm.medium,
                date_added: this.props.publisherForm.dateFrom,
                expiration_date: this.props.publisherForm.dateTo,
                url: null,
                price: this.props.publisherForm.price,
                currency: this.props.currencyFilter,
                ad_format: this.props.publisherForm.adFormat,
                classtype: "listing",
                advertiser: 'none',
                publisher: localStorage.getItem('role'),
                owner: localStorage.getItem('role')
            }
        }
        
    }

    render () {
        if (this.state.posted && this.state.finished && this.state.err === null){
            // successfully posted to create listing
            return <Alert bsStyle='success'>Congratulations! Your listing is successfully created.</Alert>
        }else if (this.state.posted && this.state.finished && this.state.err !== null){
            // there's an error catched after posting
            return <Alert bsStyle='danger'>Oops! Something went wrong, please contact our team if the problem persist!</Alert>
        }else if (this.state.posted && !this.state.finished){
            // waiting for response, loading
            return <CircularProgress />
        }else {
            // haven't posted yet, return the magical submit button
            return <Button 
                color='primary' 
                variant='raised' 
                className={this.props.classname}
                onClick={() => this.handleSubmitClick()}
            >
                Confirm
            </Button>
        }
    }
}

const mapStateToProps = (state) => {
    return {
        modeFilter      : state.MenuBarFilterReducer.modeFilter,
        currencyFilter  : state.MenuBarFilterReducer.currencyFilter,
        advertiserForm  : state.CreateListingFormReducer.advertiserForm,
        publisherForm   : state.CreateListingFormReducer.publisherForm
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormSubmitButton);