import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { FormGroup, FormControl } from 'react-bootstrap';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css'
import './MakeOfferSection.component.css';

class MakeOfferSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processing: false,
            bought: false,
            offerAmount: -1,
            offerDateRange: {
                from: undefined,
                to: undefined,
            },
            offerMessage: '',
            showOfferModal: false
        }

        this.handleMakeOffer = this.handleMakeOffer.bind(this);
        this.isBadOffer = this.isBadOffer.bind(this);
        this.handleOfferChange = this.handleOfferChange.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.onResetRangeClick = this.onResetRangeClick.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    handleMakeOffer() {
        this.setState({
            ...this.state,
            processing: true,
        })
        const offerURL = `https://qchain-marketplace-postgrest.herokuapp.com/offer`;
        const config = {
            headers: { Authorization: "Bearer " + localStorage.getItem('id_token') }
        };
        const payload = {
            listing_id: this.props.listing.id,
            currency: this.props.listing.currency,
            price: this.state.offerAmount,
            sender: localStorage.getItem('role'),
            receiver: this.props.listing.owner,
            owner: this.props.listing.owner,
            start_date: this.state.offerDateRange.from,
            end_date: this.state.offerDateRange.to,
            message: this.state.offerMessage
        }
        axios.post(offerURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
                this.setState({
                    ...this.state,
                    bought: true,
                    processing: false,
                    showOfferModal: false
                })
            })
            .catch((err) => {
                console.log("MAKE OFFER ERR");
                console.log(err);
            })
    }

    handleShowModal() {
        this.setState({ ...this.state, showOfferModal: true })
    }

    handleHideModal() {
        this.setState({ ...this.state, showOfferModal: false })
    }

    isBadOffer() {
        return this.state.offerAmount <= 0
            || typeof this.state.offerDateRange.from === 'undefined'
            || typeof this.state.offerDateRange.to === 'undefined';
    }

    handleOfferChange(event) {
        this.setState({
            ...this.state,
            offerAmount: event.target.value
        })
    }

    onResetRangeClick() {
        this.setState({
            ...this.state,
            offerDateRange: {
                from: undefined,
                to: undefined
            }
        })
    }

    handleDayClick(day) {
        const range = DateUtils.addDayToRange(day, this.state.offerDateRange);
        this.setState({
            ...this.state,
            offerDateRange: range
        })
    }

    handleMessageChange(event) {
        this.setState({
            ...this.state,
            offerMessage: event.target.value
        })
    }

    static defaultProps = {
        numberOfMonths: 2
    }

    render() {
        const { from, to } = this.state.offerDateRange;
        const modifiers = { start: from, end: to };
        return <div className='make-offer-button-container'>

            {
                (this.state.bought)
                    ? <Alert bsStyle='success'>Congratulations! You've made the offer!</Alert>
                    : <div className='buy-section'>
                        <Button
                            onClick={this.handleShowModal}
                            className='buy-button'
                            variant='outlined'
                            color='primary'
                        >
                            Make Offer
                        </Button>
                    </div>
            }
            <Modal show={this.state.showOfferModal} onHide={this.handleHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Make Your Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup controlId='control-form-title'>
                        <h4>Offer Amount</h4>
                        <FormControl onChange={this.handleOfferChange} placeholder='Enter Offer Price' type='number' min='1' step='1' />
                    </FormGroup>
                    <FormGroup controlId='control-form-pitch'>
                        <h4>Brief Message</h4>
                        <FormControl componentClass='textarea'
                            maxLength={150}
                            rows={5}
                            style={{ resize: 'vertical' }}
                            onChange={this.handleMessageChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <div>
                            <div className="date-range-container">
                                <DayPicker
                                    className="Selectable"
                                    numberOfMonths={this.props.numberOfMonths}
                                    selectedDays={[from, { from, to }]}
                                    modifiers={modifiers}
                                    onDayClick={this.handleDayClick}
                                />
                                <p className='selected-range-label'>
                                    {!from && !to && 'Please select the first day'}
                                    {from && !to && 'Please select the last day'}
                                    {from && to && `Selected from ${from.toLocaleDateString()}
                            to ${to.toLocaleDateString()}`}{'  '}
                                    {from && to && (
                                        <button className='link' onClick={this.onResetRangeClick}>
                                            Reset
                            </button>
                                    )}
                                </p>
                            </div>
                        </div>
                    </FormGroup>
                </Modal.Body>

                <Alert bsStyle='info'>
                    <Button
                        onClick={this.handleMakeOffer}
                        disabled={this.state.processing || this.isBadOffer()}
                        style={{ width: '100%', fontSize: '15px' }}
                        color='primary'
                    >
                        Make Offer
                    </Button>
                </Alert>
            </Modal>
        </div>
    }
}

export default MakeOfferSection;