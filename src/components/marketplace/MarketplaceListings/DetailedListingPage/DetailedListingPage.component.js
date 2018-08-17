/*
Core Libs
*/
import React, { Component } from 'react';
import { connect }          from 'react-redux';
import { withRouter }       from 'react-router-dom';

/*
Networking 
*/
import axios from 'axios';

/*
Local CSS
*/
import './DetailedListingPage.component.css';

/*
Placeholder Images
*/
import branded_content_ph      from '../../../../assets/images/branded_content_placeholder.png';
import influencer_marketing_ph from '../../../../assets/images/influencer_marketing_placeholder.png';
import sponsorships_ph         from '../../../../assets/images/sponsorships_placeholder.png';
import default_ph              from '../../../../assets/images/pug_face.jpg';

import { Card, CardText, CardTitle }  from 'material-ui';
import Divider                        from 'material-ui/Divider';
import Button                         from '@material-ui/core/Button';

import DetailedImageSlider from './DetailedImageSlider/DetailedImageSlider.component';

import { Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import MakeOfferSection from './MakeOfferSection/MakeOfferSection.component';


class DetailedListingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            error: null,
            listing: null,
            width: window.innerWidth,
            bought: false, 
            processing: false,
            emptyResponse: false,
            offerAmount: -1,
            actionInfo: '',
        }

        // Binding functions
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.decideImage = this.decideImage.bind(this);
        this.inactivateListing = this.inactivateListing.bind(this);
        this.handleBuyItNow = this.handleBuyItNow.bind(this);
        this.loadDetail = this.loadDetail.bind(this);
        this.createContractAfterBalanceCheck = this.createContractAfterBalanceCheck.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ ...this.state, width: window.innerWidth });
    }

    decideImage(url, marketingType) {
        if(marketingType === 'Branded Content'){
            return branded_content_ph;
        }else if(marketingType === 'Influencer Post'){
            return influencer_marketing_ph;
        }else if(marketingType === 'Sponsorship'){
            return sponsorships_ph;
        }else{
            return default_ph;
        }
    }

    componentWillMount() {
        this.loadDetail();
    }

    loadDetail() {
        // call on start load to get data
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/detailed_listing_view?id=eq.${this.props.match.params.id}`;
        const config = {
            headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        axios.get(listingURL, config)
            .then((response) => {
                if(response.data.length < 1){
                    this.setState({
                        ...this.state,
                        emptyResponse: true,
                        fetched: true
                    })
                }else {
                    document.title = `${response.data[0].name} - Qchain`;
                    this.setState({
                        ...this.state,
                        fetched: true,
                        listing: response.data[0]
                    })
                } 
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    fetched: true,
                    error: err
                })                
        })
    }

    handleBuyItNow() {
        // check balance
        this.setState({
            ...this.state,
            processing: true,
        })
        const walletURL = `https://qchain-marketplace-postgrest.herokuapp.com/wallet_view`;
        const config = {
            headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        
        axios.get(walletURL, config)
            .then((response) => {
                //success, response.data[0]
                if(this.state.listing.currency === 'EQC'){
                    if(response.data[0].eqc_balance >= this.state.listing.price){
                        this.createContractAfterBalanceCheck(response.data[0].eqc_balance)
                    }else{
                        this.setState({
                            ...this.state,
                            processing: false,
                            actionInfo: 'Insufficient EQC on your account'
                        })
                    }
                }else{
                    if(response.data[0].xqc_balance >= this.state.listing.price){
                        this.createContractAfterBalanceCheck(response.data[0].xqc_balance)
                    }else{
                        this.setState({
                            ...this.state,
                            processing: false,
                            actionInfo: 'Insufficient XQC on your account'
                        })
                    }
                }
            })
            .catch((err) => {
                console.log("BUY IT NOW ERR");
                console.log(err);                
        })
    }

    createContractAfterBalanceCheck(balance){
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/contract`;
        const config = {
            headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        const payload = {
            name: this.state.listing.name,
            advertiser: localStorage.getItem('role'),
            publisher: this.state.listing.owner,
            start_date: this.state.listing.date_added,
            end_date: this.state.listing.expiration_date,
            currency: this.state.listing.currency,
            payout_cap: this.state.listing.price,
            contentspacelisting: this.state.listing.id,
            contentlisting: null
        }
        axios.post(listingURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
                this.setState({
                    ...this.state,
                    bought: true
                })
                this.inactivateListing();
                this.makePayment(balance);
            })
            .catch((err) => {
                console.log("BUY IT NOW ERR");
                console.log(err);                
        })
    }

    inactivateListing() {
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/listing?id=eq.${this.state.listing.id}`;
        const config = {
            headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        const payload = {
            isactive: false
        }
        axios.patch(listingURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
            })
            .catch((err) => {
                console.log("INACTIVATE ERR");
                console.log(err);                
        })
    }

    makePayment(existingBalance) {
        const listingURL = `https://qchain-marketplace-postgrest.herokuapp.com/wallet_view`;
        const config = {
            headers: {Authorization: "Bearer " + localStorage.getItem('id_token')}
        };
        const payload = (this.state.listing.currency === 'EQC')
                            ? { eqc_balance: (existingBalance - this.state.listing.price) }
                            : { xqc_balance: (existingBalance - this.state.listing.price) }
        axios.patch(listingURL, payload, config)
            .then(() => {
                //success, toggle isactive on this listing to false
            })
            .catch((err) => {
                console.log("INACTIVATE ERR");
                console.log(err);                
        })
    }

    render() {
        // console.log(this.props.match.params.id)
        // make a request to get detailed listing info using ID
        // parse info onto the page
        if(this.state.fetched && !this.state.emptyResponse) {
            if (this.state.listing.classtype === "request") {
                return <div className='detailed-listing-container'>
                    <DetailedRequestListing 
                        listing={this.state.listing}
                        decideImage={this.decideImage}
                    />
                </div>
            }else {
                return <div className='detailed-listing-container'>
                    <DetailedContentSpaceListing 
                        listing={this.state.listing} 
                        decideImage={this.decideImage}
                        onBuy={this.handleBuyItNow}
                        bought={this.state.bought}
                        processing={this.state.processing}
                        issue={this.state.actionInfo}
                    />
                </div>
            }
        }else if (this.state.fetched && this.state.emptyResponse) {
            return <Redirect to='/marketplace' />
        }else {
            return <div></div>
        }
    }
}

const DetailedRequestListing = ({ listing, decideImage, onOfferChange, badOffer, makeOfferClick, bought, processing }) => (
    

    <div className='detailed-listing-renderer'>
        <div className='detailed-image-container'>
            <Card>
                <CardText>
                    <DetailedImageSlider imageSrc={decideImage(listing.images, listing.ad_format)} />
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Save this listing</a>
                <Divider />
                <a className='detailed-listing-action'>Add to watch list</a>
                <Divider />
                <a className='detailed-listing-action'>Some other simple actions</a>
                <Divider />
            </div>
        </div>
        
        <Card className='listing-concrete-details-container'>
            <CardTitle>
            <h1>{listing.name}</h1>
            </CardTitle>
            <Divider />
            <CardText className='listing-details-text'>
            <div className='details-text'>
                <p>
                    Ad Format: {listing.ad_format} {listing.classtype} 
                </p>
                <p>
                    Marketing Medium: {listing.medium}
                </p>
                
            </div>
            <br /> 
                <MakeOfferSection listing={listing}/>
            <br />
            <div className='details-text'>{listing.description}</div>
            </CardText>
        </Card>
        
        <div className='poster-info-container'>
            <Card>
                <CardTitle>
                    <h3>Requestor Info:</h3>
                    <span>{listing.owner_name} trading in {listing.currency}</span>
                </CardTitle>
                <CardText>
                <div>Ask Date: {listing.date_added.slice(0,10)}</div>
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Add requestor to favorite</a>
                <Divider />
                <a className='detailed-listing-action'>Contact this requestor</a>
                <Divider />
            </div>
        </div>
    </div>
)

const DetailedContentSpaceListing = ({ listing, decideImage, onBuy, bought, processing, issue}) => (
    <div className='detailed-listing-renderer'>
        <div className='detailed-image-container'>
            <Card>
                <CardText>
                    <DetailedImageSlider imageSrc={decideImage(listing.images, listing.ad_format)} />
                    
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Save this listing</a>
                <Divider />
                <a className='detailed-listing-action'>Add to watch list</a>
                <Divider />
                <a className='detailed-listing-action'>Some other simple actions</a>
                <Divider />
            </div>
        </div>
        
        <Card className='listing-concrete-details-container'>
            <CardTitle>
            <h1>{listing.name}</h1>
            </CardTitle>
            <Divider />
            <CardText className='listing-details-text'>
            <div className='details-text'>
                <p>
                    Ad Format: {listing.ad_format} {listing.classtype} 
                </p>
                <p>
                    Marketing Medium: {listing.medium}
                </p>
                
            </div>
            
            <br />
            
                {
                    (bought)
                    ? <Alert bsStyle='success'>Congratulations! You've bought this listing!</Alert>
                    :<div className='buy-section'>
                        <div className='price-section'>Price: {listing.price} {listing.currency}</div>
                            <Button className='buy-button' 
                                onClick={()=>onBuy()} 
                                variant='outlined' 
                                color='primary'
                                disabled={processing || issue.length > 0}
                            >
                                {
                                    (issue.length > 0 )
                                        ? issue
                                        : 'Buy It Now!'
                                }
                            </Button> 
                    </div>
                }
            
            <br />
            <div className='details-text'>{listing.description}</div>
            </CardText>
        </Card>
        
        <div className='poster-info-container'>
            <Card>
                <CardTitle>
                    <h3>Creator Info:</h3>
                    <h4>{listing.owner_name} trading in {listing.currency}</h4>
                </CardTitle>
                <CardText>
                
                <div>Promotion Duration: <br/> {listing.date_added.slice(0,10)} to {listing.expiration_date}</div>
                </CardText>
            </Card>
            <div className='detailed-listing-action-section'>
                <a className='detailed-listing-action'>Add publisher to favorite</a>
                <Divider />
                <a className='detailed-listing-action'>Contact this publisher</a>
                <Divider />
            </div>
        </div>

        
    </div>
)

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DetailedListingPage));